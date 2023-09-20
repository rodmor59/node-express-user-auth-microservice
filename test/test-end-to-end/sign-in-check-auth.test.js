const supertest = require('supertest')

const app = require('../../src/app') //The app that will be tested.
const { delayTime, userStatus } = require('../setup/parameters') //The testing parameters
const createSignedUpUser = require('../fixtures/create-signed-up-user') // Fixture
const { signMockJWT, signMockJWTUserSignin } = require('../fixtures/sign-mock-jwt')
const { isValidDate } = require('../utils/verif-types')
const usersFindDbUtils = require('../utils/db-find-users')
const delay = require('../utils/delay')
const deleteUser = require('../teardowns/delete-user') //Teardown

//Consts
const route = '/sign-in/check-auth'

describe('GET /sign-in/check-auth', () => {

    let mockDataUserId
    let signinCheckAuthMockJWT

    const { 
        signinCheckAuthMockData, 
        signinCheckAuthMockDataSecond,
        signinCheckAuthMockDataSuccess,
        signinCheckAuthMockDataNotFound, 
        signinCheckAuthPendingMockData, 
        signinCheckAuthLockFailPwdMockData, 
        signinCheckAuthNotEnbMockData,
    } = require('../fixtures/mock-data/sign-in-check-auth') //Test user data

    beforeAll(async () => {
        /*
        Cleanup Mock data that may have not been deleted in previous test executions due to test interruption, otherwise
        there could be duplicate key errors
        */
        await Promise.all([
            deleteUser(signinCheckAuthMockData.email),
            deleteUser(signinCheckAuthMockDataSecond.email),
            deleteUser(signinCheckAuthMockDataSuccess.email),
            deleteUser(signinCheckAuthMockDataNotFound.email),
            deleteUser(signinCheckAuthPendingMockData.email),
            deleteUser(signinCheckAuthLockFailPwdMockData.email),
            deleteUser(signinCheckAuthNotEnbMockData.email)
        ])
        // Saves a Mock user to the database
        mockDataUserId = (await createSignedUpUser(signinCheckAuthMockData,undefined,true))._id.toString()
        // Signs a token with the new user id
        signinCheckAuthMockJWT = signMockJWTUserSignin(
            {userId: mockDataUserId},
            '2m' //More than enough time to execute this suite of tests
        ) 
    })

    afterAll(async () => {
        // Deletes the mock user from the database
        await deleteUser(signinCheckAuthMockData.email)
    })
    
    test('Rejects when authorization token was not received', async () => {
        const response = await supertest(app)
            .get(route)
        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is invalid', async () => {
        const jwtToSend = signinCheckAuthMockJWT.slice(0, -5) //Minor alteration to the Mock token used in the suite to make it invalid

        const response = await supertest(app)
            .get(route)
            .set('authorization', `Bearer ${jwtToSend}`)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token has expired', async () => {
        //Sign a token that inmediately expires
        const jwtToSend = signMockJWTUserSignin({userId: mockDataUserId}, '0s')

        const response = await supertest(app)
            .get(route)
            .set('authorization', `Bearer ${jwtToSend}`) //Expired token sent without alterations

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid but the payload does not include an opType', async () => {
        
        const jwtToSend = signMockJWT({userId: mockDataUserId}, '30s') // Token payload doesn't include the opType

        const response = await supertest(app)
            .get(route)
            .set('authorization', `Bearer ${jwtToSend}`)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid, the payload include a opType, but the opType is not a string)', async () => {
        
        const jwtToSend = signMockJWT({userId: mockDataUserId , opType: true}, '30s') // Token payload includes the opType but it is not a string

        const response = await supertest(app)
            .get(route)
            .set('authorization', `Bearer ${jwtToSend}`)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid, but the payload the wrong opType)', async () => {
        
        const jwtToSend = signMockJWT({userId: mockDataUserId , opType: 'Wrong op type'}, '30s') // Token payload includes the opType that is a string but it is not the 'signin' opType

        const response = await supertest(app)
            .get(route)
            .set('authorization', `Bearer ${jwtToSend}`)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid but the payload does not include the user Id', async () => {
        //Sign a token without the userId prop
        const jwtToSend = signMockJWTUserSignin({missSpelledUserIdProp: mockDataUserId}, '30s') //Note: The expiration time is greater to avoid rejections for this cause

        const response = await supertest(app)
            .get(route)
            .set('authorization', `Bearer ${jwtToSend}`)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid, the payload include the userId but in the wrong format (Not a document id)', async () => {
        //Sign a token with an invalid value for the userId
        const jwtToSend = signMockJWTUserSignin({userId: 'not a document id'}, '30s') //Note: The expiration time is greater to avoid rejections for this cause

        const response = await supertest(app)
            .get(route)
            .set('authorization', `Bearer ${jwtToSend}`)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when user id doesn’t match with a user stored in the database (although the token and id are valid)', async () => {
        try {
            // Create a signed up user and get its user id
            const mockDataId = (await createSignedUpUser(signinCheckAuthMockDataNotFound, undefined, true))._id.toString()
            // Sign a token with this user id, which is different than the id of mockDataUser
            const jwtToSend = signMockJWTUserSignin({ userId: mockDataId }, '30s') //Note: The expiration time is greater to avoid rejections for this cause
            // Delete the user from the database
            await deleteUser(signinCheckAuthMockDataNotFound.email)

            const response = await supertest(app)
                .get(route)
                .set('authorization', `Bearer ${jwtToSend}`)

            expect(response.status).toBe(404) //Not found
            expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String)
            })
        }
        finally {
            await deleteUser(signinCheckAuthMockDataSecond.email)
        }
    })

    // ----------------------------- Grouping of user non-enabled status tests -------------------------------------------------
    test.each([
        {
            mockData: signinCheckAuthPendingMockData,
            testDescription: 'Rejects when the user is in pending status',
            expectedRespStatus: 490, //The application uses a custom http response code
            userStatus: userStatus.pending
        },
        {
            mockData: signinCheckAuthLockFailPwdMockData,
            testDescription: 'Rejects when the user is locked due to multiple failed signin attemps',
            expectedRespStatus: 491, //The application uses a custom http response code
            userStatus: userStatus.lockedFailedLogin
        },
        {
            mockData: signinCheckAuthNotEnbMockData,
            testDescription: 'Rejects when the user is a non-enabled status (any status different than enabled',
            expectedRespStatus: 403, //The application uses a custom http response code
            userStatus: 'Any status different from enabled'
        },
    ])('$testDescription', async (test) => {
        try {
            /*
            Fixture. Tests insert their own mock data in the database, since it requires users with different statuses
            */
            const mockData = await createSignedUpUser(test.mockData, test.userStatus, true)
            const mockDataId = mockData._id.toString()
            const previousLastAccessOn = mockData.lastAccessOn
            // Sign a token with this user id, which is different than the id of mockDataUser
            const jwtToSend = signMockJWTUserSignin({ userId: mockDataId }, '30s') //Note: The expiration time is greater to avoid rejections for this cause
            
            //Execute test
            const response = await supertest(app)
                .get(route)
                .set('authorization', `Bearer ${jwtToSend}`)
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
            // Check that the lastAccessOn is still a date type
            const accessedUser = await usersFindDbUtils.userFindById(mockDataId)
            let isDate = isValidDate(accessedUser.lastAccessOn)
            expect(isDate).toBeTruthy()
            // Check that the last access date is updated
            const lastAccessDateWasUpdated = (accessedUser.lastAccessOn > previousLastAccessOn)
            expect(lastAccessDateWasUpdated).toBeTruthy()
        } finally {
            // Teardown Mock data regardless of test result
            await deleteUser(test.mockData.email)
        }
    })

    test('Accepts request and responds with user data when all checks passed', async () => {

        try {
            const successMockUserObj = await createSignedUpUser(signinCheckAuthMockDataSuccess, undefined, true)
            const mockUserId = successMockUserObj._id
            // Sign a token with this user id, which is different than the id of mockDataUser
            const jwtToSend = signMockJWTUserSignin({ userId: mockUserId }, '30s') //Note: The expiration time is greater to avoid rejections for this cause
            // Store the lastAccessOn date when the user was saved to the db
            const previousLastAccessOn = successMockUserObj.lastAccessOn

            const response = await supertest(app)
                .get(route)
                .set('authorization', `Bearer ${jwtToSend}`)

            expect(response.status).toBe(200) //Expects an Ok http response
            expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String)
            })

            /* 
            Delay a second to give a chance for the user's  lastAccessOn data to update in the database, 
            since these dates updates are asyncronous
            */
            await delay(delayTime)
            // Check that the lastAccessOn is still a date type
            const accessedUser = await usersFindDbUtils.userFindById(mockUserId)
            let isDate = isValidDate(accessedUser.lastAccessOn)
            expect(isDate).toBeTruthy()
            // Check that the last access date is updated
            const lastAccessDateWasUpdated = (accessedUser.lastAccessOn > previousLastAccessOn)
            expect(lastAccessDateWasUpdated).toBeTruthy()
        }
        finally {
            // Teardown Mock data regardless of test result
            await deleteUser(signinCheckAuthMockDataSuccess.email)
        }
    })
})