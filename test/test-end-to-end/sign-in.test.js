const jwt = require('jsonwebtoken')
const supertest = require('supertest')

const app = require('../../src/app') //The app that will be tested.
const { userStatus } = require('../setup/parameters') //The testing parameters
const { signinMockData, signinPendingMockData, signinLockFailPwdMockData, signinNotEnbMockData } = require('../fixtures/mock-data') //Test user data
const createSignedUpUser = require('../fixtures/create-signed-up-user') // Fixture
const deleteUser = require('../teardowns/delete-user') //Teardown
const verifDbIdType = require('../utils/verif-db-id-type')

//URL Routes constants
const signinRoute = '/sign-in'

// ---------------------------- POST /sign-up Tests ----------------------------------------------------

describe('POST /sign-in', () => {

    beforeAll(async () => {
        // Saves a Mock user to the database
        await createSignedUpUser(signinMockData)
    
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
        {
            mockData: {
                email: signinMockData.email,
                password: 'pwdMock21*', //This password is wrong
            },
            testDescription: 'Rejects when the password is incorrect (wrong password)',
            expectedRespStatus: 401, //Unathorized because the password is incorrect
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
            await createSignedUpUser(test.mockData, test.userStatus)

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
        } finally {
            // Teardown Mock data regardless of test result
            await deleteUser(test.mockData.email)
        }
    })

    // ----------------------------- End of grouping of user non-enabled status tests ---------------------------------------

    test('Accepts sigin in when data is correct and returns token and user info', async () => {

        const response = await supertest(app)
            .post(signinRoute)
            .send({ //Mock data has all the user fields, must send only email and password otherwise the signin endpoint will reject them
                email: signinMockData.email,
                password: signinMockData.password
            })

        expect(response.status).toBe(200) //Expects an Ok http response
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String),
            signinToken: expect.any(String),
            userInfo: {
                _id: expect.any(String)
            }
        })

        // Assert that the signinToken is a properly formed signin JWT token
        const isVerified = jwt.verify(response.body.signinToken.replace('Bearer ', ''), process.env.JWT_SECRET_SIGNIN)
        expect(isVerified).toBeTruthy()

        // Assert that the _id is a valid DB id type.
        const isDbObjId = verifDbIdType(response.body.userInfo._id)
        expect(isDbObjId ).toBeTruthy()

    })
})