const supertest = require('supertest')

const app = require('../../src/app') //The app that will be tested.
const { delayTime, userStatus } = require('../setup/parameters') //The testing parameters
const createSignedUpUser = require('../fixtures/create-signed-up-user') // Fixture
const { signMockJWT, signMockJWTUserSignin } = require('../fixtures/sign-mock-jwt')
const usersFindDbUtils = require('../utils/db-find-users')
const { isValidDate } = require('../utils/verif-types')
const delay = require('../utils/delay')
const deleteUser = require('../teardowns/delete-user') //Teardown

//Consts
const usersRoute = '/users'

describe('PATCH /users/:id', () => {

    let mockDataUserId
    let usersPatchMockJWT

    const { 
        usersPatchMockData, 
        usersPatchMockDataSecond,
        usersPatchMockDataSuccess,
        usersPatchMockDataNotFound, 
        usersPatchPendingMockData, 
        usersPatchLockFailPwdMockData, 
        usersPatchNotEnbMockData,
        usersPatchMockDataUpdates
    } = require('../fixtures/mock-data/users-patch') //Test user data

    beforeAll(async () => {
        /*
        Cleanup Mock data that may have not been deleted in previous test executions due to test interruption, otherwise
        there could be duplicate key errors
        */
        await Promise.all([
            deleteUser(usersPatchMockData.email),
            deleteUser(usersPatchMockDataSecond.email),
            deleteUser(usersPatchMockDataSuccess.email),
            deleteUser(usersPatchMockDataNotFound.email),
            deleteUser(usersPatchPendingMockData.email),
            deleteUser(usersPatchLockFailPwdMockData.email),
            deleteUser(usersPatchNotEnbMockData.email)
        ])
        // Saves a Mock user to the database
        mockDataUserId = (await createSignedUpUser(usersPatchMockData,undefined,true))._id.toString()
        // Signs a token with the new user id
        usersPatchMockJWT = signMockJWTUserSignin(
            {userId: mockDataUserId},
            '2m' //More than enough time to execute this suite of tests
        ) 
    })

    afterAll(async () => {
        // Deletes the mock user from the database
        await deleteUser(usersPatchMockData.email)
    })
    
    test('Rejects when the received user id is not a valid database id pattern', async () => {
        const response = await supertest(app)
            .patch(`${usersRoute}/nodbtype`)
            .set('authorization', `Bearer ${usersPatchMockJWT}`)
            .send(usersPatchMockDataUpdates)
        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('Rejects when no body is received', async () => {
        const response = await supertest(app)
            .patch(`${usersRoute}/${mockDataUserId}`)
            .set('authorization', `Bearer ${usersPatchMockJWT}`)
        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    // ------------------------------- Request body validation group --------------------------------------------
    test.each([
        {
            mockData: {
                //First name prop is missing
                lastName: usersPatchMockDataUpdates.lastName,
                receiveEmails: usersPatchMockDataUpdates.receiveEmails
            },   
            testDescription: 'Rejects when the first name is missing',
            expectedRespStatus: 400
        },
        {
            mockData: {
                ...usersPatchMockDataUpdates,
                firstName: true, //First name prop is set to a non-string value
            },   
            testDescription: 'Rejects when the first name is not a string',
            expectedRespStatus: 400
        },
        {
            mockData: {
                ...usersPatchMockDataUpdates,
                firstName: 'R*ich*ar~d==++', //First name is set to contain invalid characters for a name
            },   
            testDescription: 'Rejects when the first name format is invalid',
            expectedRespStatus: 400
        },
        {
            mockData: {
                firstName: usersPatchMockDataUpdates.firstName, //Last name prop is missing
                receiveEmails: usersPatchMockDataUpdates.receiveEmails
            },   
            testDescription: 'Rejects when the the last name is missing',
            expectedRespStatus: 400
        },
        {
            mockData: {
                ...usersPatchMockDataUpdates,
                lastName: true, //Last name prop set to a non-string value
            },   
            testDescription: 'Rejects when the last name is not a string',
            expectedRespStatus: 400
        },
        {
            mockData: {
                ...usersPatchMockDataUpdates,
                lastName: 'B*r~o123wn', //Last name prop set to include invalid characters for a name
            },   
            testDescription: 'Rejects when the last name format is invalid',
            expectedRespStatus: 400
        },
        {
            mockData: {
                firstName: usersPatchMockDataUpdates.firstName,
                lastName: usersPatchMockDataUpdates.lastName, //receiveEmails prop is missing
            },   
            testDescription: 'Rejects when the field "receiveEmails" is missing',
            expectedRespStatus: 400
        },
        {
            mockData: {
                ...usersPatchMockDataUpdates,
                receiveEmails: 'Not a boolean' //receiveEmails prop set to a non-boolean value
            },   
            testDescription: 'Rejects when the field "receiveEmails" is not a boolean',
            expectedRespStatus: 400
        },
        {
            mockData: {
                ...usersPatchMockDataUpdates,
                notAllowed: true // This field is not allowed by the sign-in schema
            },
            testDescription: 'Rejects when receiving a field not specified in the schema',
            expectedRespStatus: 400
        },
    ])('$testDescription', async (test) => {
        const response = await supertest(app)
            .patch(`${usersRoute}/${mockDataUserId}`)
            .set('authorization', `Bearer ${usersPatchMockJWT}`)
            .send(test.mockData)
        expect(response.status).toBe(test.expectedRespStatus)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    // ------------------------------- End of request body validation group --------------------------------------

    test('Rejects when authorization token was not received', async () => {
        const response = await supertest(app)
            .patch(`${usersRoute}/${mockDataUserId}`)
            .send(usersPatchMockDataUpdates)
        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is invalid', async () => {
        const jwtToSend = usersPatchMockJWT.slice(0, -5) //Minor alteration to the Mock token used in the suite to make it invalid

        const response = await supertest(app)
            .patch(`${usersRoute}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)
            .send(usersPatchMockDataUpdates)

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
            .patch(`${usersRoute}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`) //Expired token sent without alterations
            .send(usersPatchMockDataUpdates)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid but the payload does not include an opType', async () => {
        
        const jwtToSend = signMockJWT({userId: mockDataUserId}, '30s') // Token payload doesn't include the opType

        const response = await supertest(app)
            .patch(`${usersRoute}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)
            .send(usersPatchMockDataUpdates)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid, the payload include a opType, but the opType is not a string)', async () => {
        
        const jwtToSend = signMockJWT({userId: mockDataUserId , opType: true}, '30s') // Token payload includes the opType but it is not a string

        const response = await supertest(app)
            .patch(`${usersRoute}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)
            .send(usersPatchMockDataUpdates)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid, but the payload the wrong opType)', async () => {
        
        const jwtToSend = signMockJWT({userId: mockDataUserId , opType: 'Wrong op type'}, '30s') // Token payload includes the opType that is a string but it is not the 'signin' opType

        const response = await supertest(app)
            .patch(`${usersRoute}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)
            .send(usersPatchMockDataUpdates)

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
            .patch(`${usersRoute}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)
            .send(usersPatchMockDataUpdates)

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
            .patch(`${usersRoute}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)
            .send(usersPatchMockDataUpdates)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when user id of the token payload is different from the id of the params of the called route', async () => {
        try {
            // Create a second signed up user and get its user id
            const mockDataSecondUserId = (await createSignedUpUser(usersPatchMockDataSecond, undefined, true))._id.toString()
            // Sign a token with this user id, which is different than the id of mockDataUser
            const jwtToSend = signMockJWTUserSignin({ userId: mockDataSecondUserId }, '30s') //Note: The expiration time is greater to avoid rejections for this cause

            const response = await supertest(app)
                .patch(`${usersRoute}/${mockDataUserId}`) //Send as param in the route an id different than the one used to sign the token
                .set('authorization', `Bearer ${jwtToSend}`)
                .send(usersPatchMockDataUpdates)

            expect(response.status).toBe(401) //This is a bad request, the user is requested with a token not signed with it's id
            expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String)
            })
        }
        finally {
            await deleteUser(usersPatchMockDataSecond.email)
        }
    })
    test('Rejects when user id doesn’t match with a user stored in the database (although the token and id are valid)', async () => {
        try {
            // Create a signed up user and get its user id
            const mockDataId = (await createSignedUpUser(usersPatchMockDataNotFound, undefined, true))._id.toString()
            // Sign a token with this user id, which is different than the id of mockDataUser
            const jwtToSend = signMockJWTUserSignin({ userId: mockDataId }, '30s') //Note: The expiration time is greater to avoid rejections for this cause
            // Delete the user from the database
            await deleteUser(usersPatchMockDataNotFound.email)

            const response = await supertest(app)
                .patch(`${usersRoute}/${mockDataId}`)
                .set('authorization', `Bearer ${jwtToSend}`)
                .send(usersPatchMockDataUpdates)

            expect(response.status).toBe(404) //Not found
            expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String)
            })
        }
        finally {
            await deleteUser(usersPatchMockDataSecond.email)
        }
    })

    // ----------------------------- Grouping of user non-enabled status tests -------------------------------------------------
    test.each([
        {
            mockData: usersPatchPendingMockData,
            testDescription: 'Rejects when the user is in pending status',
            expectedRespStatus: 490, //The application uses a custom http response code
            userStatus: userStatus.pending
        },
        {
            mockData: usersPatchLockFailPwdMockData,
            testDescription: 'Rejects when the user is locked due to multiple failed signin attemps',
            expectedRespStatus: 491, //The application uses a custom http response code
            userStatus: userStatus.lockedFailedLogin
        },
        {
            mockData: usersPatchNotEnbMockData,
            testDescription: 'Rejects when the user is a non-enabled status (any status different than enabled',
            expectedRespStatus: 403, //The application uses a custom http response code
            userStatus: 'Any status different from enabled'
        },
    ])('$testDescription', async (test) => {
        try {
            /*
            Fixture. Tests insert their own mock data in the database, since it requires users with different statuses
            */
            const createdUser = (await createSignedUpUser(test.mockData, test.userStatus, true))
            const mockDataId = createdUser._id.toString()
            const previousLastAccessOn = createdUser.lastAccessOn
            // Sign a token with this user id, which is different than the id of mockDataUser
            const jwtToSend = signMockJWTUserSignin({ userId: mockDataId }, '30s') //Note: The expiration time is greater to avoid rejections for this cause
            
            //Execute test
            const response = await supertest(app)
                .patch(`${usersRoute}/${mockDataId}`)
                .set('authorization', `Bearer ${jwtToSend}`)
                .send(usersPatchMockDataUpdates)
            expect(response.status).toBe(test.expectedRespStatus)
            expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String)
            })

            /* 
            Delay a second to give a chance for the user's userDataUpdatedOn  and lastAccessOn data 
            to update in the database, since these dates updates are asyncronous
            */
            await delay(delayTime)

            // Assert that lastAccessDateOn was updated correctly
            // First, assert that the lastAccessOn is still a date type
            const userToModify = await usersFindDbUtils.userFindById(mockDataId)
            let isDate = isValidDate(userToModify.lastAccessOn)
            expect(isDate).toBeTruthy()
            // Check that the last access date is updated
            const lastAccessDateWasUpdated = (userToModify.lastAccessOn > previousLastAccessOn)
            expect(lastAccessDateWasUpdated).toBeTruthy()

        } finally {
            // Teardown Mock data regardless of test result
            await deleteUser(test.mockData.email)
        }
    })

    test('Accepts request and responds with user data when all checks passed', async () => {
        try {
            /*
                Fixture. Tests insert their own mock data in the database, since it requires users with different statuses
                */
            const createdUser = (await createSignedUpUser(usersPatchMockDataSuccess, undefined, true))
            const mockDataId = createdUser._id.toString()
            const previousLastAccessOn = createdUser.lastAccessOn
            const previousUserDataUpdatedOn = createdUser.userDataUpdatedOn
            // Sign a token with this user id, which is different than the id of mockDataUser
            const jwtToSend = signMockJWTUserSignin({ userId: mockDataId }, '30s') //Note: The expiration time is greater to avoid rejections for this cause

            const response = await supertest(app)
                .patch(`${usersRoute}/${mockDataId}`)
                .set('authorization', `Bearer ${jwtToSend}`)
                .send(usersPatchMockDataUpdates)

            expect(response.status).toBe(200) //Expects an Ok http response
            expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String),
            })

            // Assert that the user data was updated successfully, by checking it at the database
            const updatedUser = await usersFindDbUtils.userFindById(mockDataId)
            expect(updatedUser.firstName).toBe(usersPatchMockDataUpdates.firstName)
            expect(updatedUser.lastName).toBe(usersPatchMockDataUpdates.lastName)
            expect(updatedUser.receiveEmails).toBe(usersPatchMockDataUpdates.receiveEmails)

            // Get updated user from the database
            const userToModify = await usersFindDbUtils.userFindById(mockDataId)
            // Assert that lastAccessDateOn was updated
            // First, assert that the lastAccessOn is still a date type
            let isDate = isValidDate(userToModify.lastAccessOn)
            expect(isDate).toBeTruthy()
            // Check that the last access date is updated
            const lastAccessDateWasUpdated = (userToModify.lastAccessOn > previousLastAccessOn)
            expect(lastAccessDateWasUpdated).toBeTruthy()

            /* 
            Delay a second to give a chance for the user's userDataUpdatedOn  and lastAccessOn data 
            to update in the database, since these dates updates are asyncronous
            */
            await delay(delayTime)

            // Assert that userDataUpdatedOn was updated
            // First, assert that the userDataUpdatedOn is still a date type
            isDate = isValidDate(userToModify.userDataUpdatedOn)
            expect(isDate).toBeTruthy()
            // Check that the last access date is updated
            const userDataUpdatedOnWasUpdated = (userToModify.userDataUpdatedOn > previousUserDataUpdatedOn)
            expect(userDataUpdatedOnWasUpdated).toBeTruthy()

        } finally {
            // Teardown Mock data regardless of test result
            await deleteUser(usersPatchMockDataSuccess.email)
        }
    })
})