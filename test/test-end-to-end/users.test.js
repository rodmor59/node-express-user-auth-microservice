const supertest = require('supertest')

const app = require('../../src/app') //The app that will be tested.
const createSignedUpUser = require('../fixtures/create-signed-up-user') // Fixture
const signMockJWT = require('../fixtures/sign-mock-jwt')
const deleteUser = require('../teardowns/delete-user') //Teardown

describe('GET /users/:id', () => {

    let mockDataUserId
    let usersGetMockJWT

    const { usersGetMockData, usersGetMockDataSecond, usersGetPendingMockData, usersGetLockFailPwdMockData, usersGetNotEnbMockData } = require('../fixtures/mock-data/users') //Test user data

    beforeAll(async () => {
        /*
        Cleanup Mock data that may have not been deleted in previous test executions due to test interruption, otherwise
        there could be duplicate key errors
        */
        await Promise.all([
            deleteUser(usersGetMockData.email),
            deleteUser(usersGetPendingMockData.email),
            deleteUser(usersGetLockFailPwdMockData.email),
            deleteUser(usersGetNotEnbMockData.email)
        ])
        // Saves a Mock user to the database
        mockDataUserId = (await createSignedUpUser(usersGetMockData)).toString()
        // Signs a token with the new user id
        usersGetMockJWT = signMockJWT(
            {userId: mockDataUserId},
            process.env.JWT_SECRET_SIGNIN, //Uses the signin secret (That is what is being tested)
            '2m' //More than enough time to execute this suite of tests
        ) 
    })

    afterAll(async () => {
        // Deletes the mock user from the database
        await deleteUser(usersGetMockData.email)
    })
    
    test('Rejects when the received user id is not a valid database id pattern', async () => {
        const response = await supertest(app)
            .get('/users/nodbtype')
        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when authorization token was not received', async () => {
        const response = await supertest(app)
            .get(`/users/${mockDataUserId}`)
        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is invalid', async () => {
        const jwtToSend = usersGetMockJWT.slice(0, -5) //Minor alteration to the Mock token used in the suite to make it invalid

        const response = await supertest(app)
            .get(`/users/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token has expired', async () => {
        //Sign a token that inmediately expires
        const jwtToSend = signMockJWT({userId: mockDataUserId}, process.env.JWT_SECRET_SIGNIN, '0s')

        const response = await supertest(app)
            .get(`/users/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`) //Expired token sent without alterations

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid but the payload does not include the user Id', async () => {
        //Sign a token without the userId prop
        const jwtToSend = signMockJWT({missSpelledUserIdProp: mockDataUserId}, process.env.JWT_SECRET_SIGNIN, '30s') //Note: The expiration time is greater to avoid rejections for this cause

        const response = await supertest(app)
            .get(`/users/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`) //Expired token sent without alterations

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid, the payload include the userId but in the wrong format (Not a document id)', async () => {
        //Sign a token with an invalid value for the userId
        const jwtToSend = signMockJWT({userId: 'not a document id'}, process.env.JWT_SECRET_SIGNIN, '30s') //Note: The expiration time is greater to avoid rejections for this cause

        const response = await supertest(app)
            .get(`/users/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`) //Expired token sent without alterations

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when user id of the token payload is different from the id of the params of the called route', async () => {
        try {
            // Create a second signed up user and get its user id
            const mockDataSecondUserId = (await createSignedUpUser(usersGetMockDataSecond)).toString()
            // Sign a token with this user id, which is different than the id of mockDataUser
            const jwtToSend = signMockJWT({ userId: mockDataSecondUserId }, process.env.JWT_SECRET_SIGNIN, '30s') //Note: The expiration time is greater to avoid rejections for this cause

            const response = await supertest(app)
                .get(`/users/${mockDataUserId}`)
                .set('authorization', `Bearer ${jwtToSend}`) //Expired token sent without alterations

            expect(response.status).toBe(400) //This is a bad request, the user is requested with a token not signed with it's id
            expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String)
            })
        }
        finally {
            await deleteUser(usersGetMockDataSecond.email)
        }
    })
})