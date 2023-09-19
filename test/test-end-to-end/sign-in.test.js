const jwt = require('jsonwebtoken')
const supertest = require('supertest')

const app = require('../../src/app') //The app that will be tested.
const { delayTime, numWrongPwdAttemptsToLockUser, userStatus } = require('../setup/parameters') //The testing parameters
const { signinMockData,
    signinWrongPasswordMockData,
    signinWrongPasswordLocksUserMockData,
    signinSuccessMockData, 
    signinPendingMockData, 
    signinLockFailPwdMockData, 
    signinNotEnbMockData 
} = require('../fixtures/mock-data/sign-in') //Test user data
const createSignedUpUser = require('../fixtures/create-signed-up-user') // Fixture
const usersFindDbUtils = require('../utils/db-find-users')
const delay = require('../utils/delay')
const verifDbIdType = require('../utils/verif-db-id-type')
const { isValidDate } = require('../utils/verif-types')
const deleteUser = require('../teardowns/delete-user') //Teardown

//URL Routes constants
const signinRoute = '/sign-in'

// ---------------------------- POST /sign-up Tests ----------------------------------------------------

describe('POST /sign-in', () => {

    beforeAll(async () => {
        /*
        Cleanup Mock data that may have not been deleted in previous test executions due to test interruption, otherwise
        there could be duplicate key errors
        */
        await Promise.all([
            deleteUser(signinMockData.email),
            deleteUser(signinWrongPasswordMockData.email),
            deleteUser(signinWrongPasswordLocksUserMockData.email),
            deleteUser(signinSuccessMockData.email),
            deleteUser(signinPendingMockData.email),
            deleteUser(signinLockFailPwdMockData.email),
            deleteUser(signinNotEnbMockData.email)
        ])
        // Saves a Mock user to the database
        await createSignedUpUser(signinMockData, undefined, false)
    })

    afterAll(async () => {
        // Deletes the mock user from the database
        await deleteUser(signinMockData.email)
    })

    // -------------- Grouping of request reject tests, since they share the same test function -------------------
    test.each([
        {
            mockData: {
                password: signinMockData.password, //Test data is missing the email field
            },
            testDescription: 'Rejects when the email is missing',
            expectedRespStatus: 400,
        },
        {
            mockData: {
                email: true,
                password: signinMockData.password,
            },
            testDescription: 'Rejects when the email is not a string',
            expectedRespStatus: 400
        },
        {
            mockData: {
                email: signinMockData.email //Test data is missing the password
            },
            testDescription: 'Rejects when the password is missing',
            expectedRespStatus: 400
        },
        {
            mockData: {
                email: signinMockData.email,
                password: true // Password is not a string
            },
            testDescription: 'Rejects when the password is not a string',
            expectedRespStatus: 400
        },
        {
            mockData: {
                email: signinMockData.email,
                password: signinMockData.password,
                notAllowed: true // This field is not allowed by the sign-in schema
            },
            testDescription: 'Rejects when receiving a field not specified in the schema',
            expectedRespStatus: 400
        },
        {
            mockData: {
                email: 'mockemaildontexist@mock.com', //There is no user with this email address registered
                password: signinMockData.password,
            },
            testDescription: 'Rejects when there is no user with the received email (username)',
            expectedRespStatus: 401, //Unathorized because there is no such user
        },
    ])('$testDescription', async (test) => {
        const response = await supertest(app)
            .post(signinRoute)
            .send(test.mockData)
        expect(response.status).toBe(test.expectedRespStatus)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    // ----------------------------- End of reject request test grouping----------------------------------------------

    // ----------------------------------------Password tests ------------------------------------------------------
    test('Rejects when the password is incorrect (wrong password)', async () => {
        /*
        Fixture. Tests insert their own mock data in the database,
        */
        const mockData = await createSignedUpUser(signinWrongPasswordMockData, undefined, false)
        const mockDataId = mockData._id.toString()
        const previousLastAccessOn = mockData.lastAccessOn
        const previousFailedLoginAttempts = mockData.failedLoginAttempts

        const response = await supertest(app)
            .post(signinRoute)
            .send({ //Mock data has all the user fields, must send only email and password otherwise the signin endpoint will reject them
                email: signinWrongPasswordMockData.email,
                password: signinWrongPasswordMockData.password + '1*' //Add characters to make the password wrong
            })

        expect(response.status).toBe(401) //Expects an Ok http response
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })

        /*
        Delay a second to give a chance for the user's lastAccessOn and failedLoginAttempts data to update in the 
        database, since these updates are asyncronous
        */
        await delay(delayTime)
        // User's lastAccessOn and lastSuccessfulLoginOn must update
        const signedInUser = await usersFindDbUtils.userFindById(mockDataId)
        // Assert that the failedLongAttempts was increased by one
        expect(signedInUser.failedLoginAttempts).toBe(previousFailedLoginAttempts + 1)
        // Assert that the lastAccessOn is still a date type
        let isDate = isValidDate(signedInUser.lastAccessOn)
        expect(isDate).toBeTruthy()
        // Assert that the last access date was updated
        const lastAccessDateWasUpdated = (signedInUser.lastAccessOn > previousLastAccessOn)
        expect(lastAccessDateWasUpdated).toBeTruthy()
    })

    test('Rejects and locks user when the password is incorrect and reached max number of login attempts', async () => {
        /*
        Fixture. Tests insert their own mock data in the database,
        */
        const mockData = await createSignedUpUser(
            signinWrongPasswordLocksUserMockData, 
            undefined, 
            false, 
            (numWrongPwdAttemptsToLockUser - 1) // User about to be locked due to failed login attempts
        )
        const mockDataId = mockData._id.toString()
        const previousLastAccessOn = mockData.lastAccessOn
        const previousFailedLoginAttempts = mockData.failedLoginAttempts

        const response = await supertest(app)
            .post(signinRoute)
            .send({ //Mock data has all the user fields, must send only email and password otherwise the signin endpoint will reject them
                email: signinWrongPasswordLocksUserMockData.email,
                password: signinWrongPasswordLocksUserMockData.password + '1*' //Add characters to make the password wrong
            })

        expect(response.status).toBe(401) //Expects an Ok http response
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })

        /*
        Delay a second to give a chance for the user's lastAccessOn and failedLoginAttempts data to update in the 
        database, since these updates are asyncronous
        */
        await delay(delayTime)
        // User's lastAccessOn and lastSuccessfulLoginOn must update
        const signedInUser = await usersFindDbUtils.userFindById(mockDataId)
        // Assert that the failedLongAttempts was increased by one
        expect(signedInUser.failedLoginAttempts).toBe(previousFailedLoginAttempts + 1)
        // Assert that the lastAccessOn is still a date type
        let isDate = isValidDate(signedInUser.lastAccessOn)
        expect(isDate).toBeTruthy()
        // Assert that the last access date was updated
        const lastAccessDateWasUpdated = (signedInUser.lastAccessOn > previousLastAccessOn)
        expect(lastAccessDateWasUpdated).toBeTruthy()
        // Asert that user has been lock due to repeated login attempts
        expect(signedInUser.status).toBe(userStatus.lockedFailedLogin)
    })


    // ----------------------------- Grouping of user non-enabled status tests ---------------------------------------

    test.each([
        {
            mockData: signinPendingMockData,
            testDescription: 'Rejects when the user is in pending status',
            expectedRespStatus: 490, //The application uses a custom http response code
            userStatus: userStatus.pending
        },
        {
            mockData: signinLockFailPwdMockData,
            testDescription: 'Rejects when the user is locked due to multiple failed signin attemps',
            expectedRespStatus: 491, //The application uses a custom http response code
            userStatus: userStatus.lockedFailedLogin
        },
        {
            mockData: signinNotEnbMockData,
            testDescription: 'Rejects when the user is a non-enabled status (any status different than enabled',
            expectedRespStatus: 403, //The application uses a custom http response code
            userStatus: 'Any status different from enabled'
        },
    ])('$testDescription', async (test) => {
        try {
            /*
            Fixture. Tests insert their own mock data in the database, since it requires users with different statuses
            */
            const mockData = await createSignedUpUser(test.mockData, test.userStatus, false)
            const mockDataId = mockData._id.toString()
            const previousLastAccessOn = mockData.lastAccessOn

            //Execute test
            const response = await supertest(app)
                .post(signinRoute)
                .send({ //Mock data has all the user fields, must send only email and password otherwise the signin endpoint will reject them
                    email: test.mockData.email,
                    password: test.mockData.password
                })
            expect(response.status).toBe(test.expectedRespStatus)
            expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String)
            })

            /* 
            Delay a second to give a chance for the user's  lastAccessOn data to update in the database, 
            since these dates updates are asyncronous
            */
            await delay(delayTime)
            // User's lastAccessOn must update
            // Check that the lastAccessOn is still a date type
            const signedInUser = await usersFindDbUtils.userFindById(mockDataId)
            let isDate = isValidDate(signedInUser.lastAccessOn)
            expect(isDate).toBeTruthy()
            // Check that the last access date is updated
            const lastAccessDateWasUpdated = (signedInUser.lastAccessOn > previousLastAccessOn)
            expect(lastAccessDateWasUpdated).toBeTruthy()

        } finally {
            // Teardown Mock data regardless of test result
            await deleteUser(test.mockData.email)
        }
    })

    // ----------------------------- End of grouping of user non-enabled status tests ---------------------------------------

    test('Accepts sigin in when data is correct and returns token and user info', async () => {
        /*
        Fixture. Tests insert their own mock data in the database,
        */
        const mockData = await createSignedUpUser(signinSuccessMockData, undefined, false)
        const mockDataId = mockData._id.toString()
        const previousLastAccessOn = mockData.lastAccessOn
        const previousLastSuccessfulLoginOn = mockData.lastSuccessfulLoginOn

        const response = await supertest(app)
            .post(signinRoute)
            .send({ //Mock data has all the user fields, must send only email and password otherwise the signin endpoint will reject them
                email: signinSuccessMockData.email,
                password: signinSuccessMockData.password //Must send unencrypted password, do not use the password from the object obtained from the database as this password has been encrypted
            })

        expect(response.status).toBe(200) //Expects an Ok http response
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String),
            signinJWT: expect.any(String),
            userInfo: {
                _id: expect.any(String)
            }
        })

        // Assert that the signinToken is a properly formed signin JWT token
        const isVerified = jwt.verify(response.body.signinJWT.replace('Bearer ', ''), process.env.JWT_SECRET_SIGNIN)
        expect(isVerified).toBeTruthy()

        // Assert that the _id is a valid DB id type.
        const isDbObjId = verifDbIdType(response.body.userInfo._id)
        expect(isDbObjId ).toBeTruthy()
        // Asserts that the id corresponds with the signed in user id
        expect(response.body.userInfo._id).toBe(mockDataId)

        /*
        Delay a second to give a chance for the user's lastAccessOn and lastSuccessfulLoginOn data to update in the database, 
        since these dates updates are asyncronous
        */
        await delay(delayTime)
        // User's lastAccessOn and lastSuccessfulLoginOn must update
        const signedInUser = await usersFindDbUtils.userFindById(mockDataId)
        // Assert that the failedLongAttempts was set to zero
        expect(signedInUser.failedLoginAttempts).toBe(0)
        // Assert that the lastAccessOn is still a date type
        let isDate = isValidDate(signedInUser.lastAccessOn)
        expect(isDate).toBeTruthy()
        // Assert that the last access date was updated
        const lastAccessDateWasUpdated = (signedInUser.lastAccessOn > previousLastAccessOn)
        expect(lastAccessDateWasUpdated).toBeTruthy()
        // Assert that the lastAccessOn is still a date type
        isDate = isValidDate(signedInUser.lastSuccessfulLoginOn)
        expect(isDate).toBeTruthy()
        // Assert that the last access date was updated
        const lastSuccessfulLoginOnWasUpdated = (signedInUser.lastSuccessfulLoginOn > previousLastSuccessfulLoginOn)
        expect(lastSuccessfulLoginOnWasUpdated).toBeTruthy()
    })
})