const supertest = require('supertest')

const app = require('../../src/app') //The app that will be tested.
const { delayTime, userStatus } = require('../setup/parameters') //The testing parameters
const createSignedUpUser = require('../fixtures/create-signed-up-user') // Fixture
const { signMockJWT, signMockJWTUserSignin } = require('../fixtures/sign-mock-jwt')
const usersFindDbUtils = require('../utils/db-find-users')
const { isValidDate } = require('../utils/verif-types')
const isPasswordValid = require('../utils/check-password')
const delay = require('../utils/delay')
const deleteUser = require('../teardowns/delete-user') //Teardown

//Consts
const route = '/users/password'

describe('PATCH /users/password/:id (Change password)', () => {

    let mockDataUserId
    let mockJWT

    const { 
        usersPasswordPatchMockData,
        mockPasswordChange,
        usersPasswordPatchMockDataSecond,
        usersPasswordPatchMockDataSuccess,
        usersPasswordPatchMockDataNotFound, 
        usersPasswordPatchMockDataWrongPassword,
        usersPasswordPatchPendingMockData, 
        usersPasswordPatchLockFailPwdMockData, 
        usersPasswordPatchNotEnbMockData
    } = require('../fixtures/mock-data/users-password-patch') //Test user data

    beforeAll(async () => {
        /*
        Cleanup Mock data that may have not been deleted in previous test executions due to test interruption, otherwise
        there could be duplicate key errors
        */
        await Promise.all([
            deleteUser(usersPasswordPatchMockData.email),
            deleteUser(usersPasswordPatchMockDataSecond.email),
            deleteUser(usersPasswordPatchMockDataSuccess.email),
            deleteUser(usersPasswordPatchMockDataNotFound.email),
            deleteUser(usersPasswordPatchMockDataWrongPassword.email),
            deleteUser(usersPasswordPatchPendingMockData.email),
            deleteUser(usersPasswordPatchLockFailPwdMockData.email),
            deleteUser(usersPasswordPatchNotEnbMockData.email)
        ])
        // Saves a Mock user to the database
        mockDataUserId = (await createSignedUpUser(usersPasswordPatchMockData,undefined,true))._id.toString()
        // Signs a token with the new user id
        mockJWT = signMockJWTUserSignin(
            {userId: mockDataUserId},
            '2m' //More than enough time to execute this suite of tests
        ) 
    })

    afterAll(async () => {
        // Deletes the mock user from the database
        await deleteUser(usersPasswordPatchMockData.email)
    })
    
    test('Rejects when the received user id is not a valid database id pattern', async () => {
        const response = await supertest(app)
            .patch(`${route}/nodbtype`)
            .set('authorization', `Bearer ${mockJWT}`)
            .send(mockPasswordChange)
        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('Rejects when no body is received', async () => {
        const response = await supertest(app)
            .patch(`${route}/${mockDataUserId}`)
            .set('authorization', `Bearer ${mockJWT}`)
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
                newPassword: mockPasswordChange.newPassword, // Previous password missing
                confirmNewPassword: mockPasswordChange.confirmNewPassword
            },   
            testDescription: 'Rejects when the previous password is missing',
            expectedRespStatus: 400
        },
        {
            mockData: {
                ...mockPasswordChange,
                currentPassword: true, // Set no non-string value
            },   
            testDescription: 'Rejects when the previous password is not a string',
            expectedRespStatus: 400
        },
        {
            mockData: {
                currentPassword: mockPasswordChange.currentPassword, // new password missing
                confirmNewPassword: mockPasswordChange.confirmNewPassword
            },   
            testDescription: 'Rejects when the new password is missing',
            expectedRespStatus: 400
        },
        {
            mockData: {
                ...mockPasswordChange,
                newPassword: true, // Set no non-string value
            },   
            testDescription: 'Rejects when the new password is not a string',
            expectedRespStatus: 400
        },
        {
            mockData: {
                ...mockPasswordChange,
                newPassword: '1234567', // Weak password
                confirmNewPassword: '1234567'
            },   
            testDescription: 'Rejects when the password format is invalid (Not strong enough)',
            expectedRespStatus: 400
        },
        {
            mockData: {
                currentPassword: mockPasswordChange.currentPassword,
                newPassword: mockPasswordChange.newPassword, // confirm new password is missing
            },   
            testDescription: 'Rejects when the confirm new password is missing',
            expectedRespStatus: 400
        },
        {
            mockData: {
                ...mockPasswordChange,
                confirmNewPassword: true, // Set no non-string value
            },   
            testDescription: 'Rejects when the confirm new password is not a string',
            expectedRespStatus: 400
        },
        {
            mockData: {
                ...mockPasswordChange,
                confirmNewPassword: 'difPassword1*' // Password is secure but doens not match the new password
            },   
            testDescription: 'Rejects when confirm new password does not match new password',
            expectedRespStatus: 400
        },
        {
            mockData: {
                ...mockPasswordChange,
                notAllowed: true // This field is not allowed by the sign-in schema
            },
            testDescription: 'Rejects when receiving a field not specified in the schema',
            expectedRespStatus: 400
        },
    ])('$testDescription', async (test) => {
        const response = await supertest(app)
            .patch(`${route}/${mockDataUserId}`)
            .set('authorization', `Bearer ${mockJWT}`)
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
            .patch(`${route}/${mockDataUserId}`)
            .send(mockPasswordChange)
        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is invalid', async () => {
        const jwtToSend = mockJWT.slice(0, -5) //Minor alteration to the Mock token used in the suite to make it invalid

        const response = await supertest(app)
            .patch(`${route}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)
            .send(mockPasswordChange)

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
            .patch(`${route}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`) //Expired token sent without alterations
            .send(mockPasswordChange)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid but the payload does not include an opType', async () => {
        
        const jwtToSend = signMockJWT({userId: mockDataUserId}, '30s') // Token payload doesn't include the opType

        const response = await supertest(app)
            .patch(`${route}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)
            .send(mockPasswordChange)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid, the payload include a opType, but the opType is not a string)', async () => {
        
        const jwtToSend = signMockJWT({userId: mockDataUserId , opType: true}, '30s') // Token payload includes the opType but it is not a string

        const response = await supertest(app)
            .patch(`${route}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)
            .send(mockPasswordChange)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when token is valid, but the payload the wrong opType)', async () => {
        
        const jwtToSend = signMockJWT({userId: mockDataUserId , opType: 'Wrong op type'}, '30s') // Token payload includes the opType that is a string but it is not the 'signin' opType

        const response = await supertest(app)
            .patch(`${route}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)
            .send(mockPasswordChange)

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
            .patch(`${route}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)
            .send(mockPasswordChange)

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
            .patch(`${route}/${mockDataUserId}`)
            .set('authorization', `Bearer ${jwtToSend}`)
            .send(mockPasswordChange)

        expect(response.status).toBe(401)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    test('Rejects when user id of the token payload is different from the id of the params of the called route', async () => {
        try {
            // Create a second signed up user and get its user id
            const mockDataSecondUserId = (await createSignedUpUser(usersPasswordPatchMockDataSecond, undefined, true))._id.toString()
            // Sign a token with this user id, which is different than the id of mockDataUser
            const jwtToSend = signMockJWTUserSignin({ userId: mockDataSecondUserId }, '30s') //Note: The expiration time is greater to avoid rejections for this cause

            const response = await supertest(app)
                .patch(`${route}/${mockDataUserId}`) //Send as param in the route an id different than the one used to sign the token
                .set('authorization', `Bearer ${jwtToSend}`)
                .send(mockPasswordChange)

            expect(response.status).toBe(401) //This is a bad request, the user is requested with a token not signed with it's id
            expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String)
            })
        }
        finally {
            await deleteUser(usersPasswordPatchMockDataSecond.email)
        }
    })
    test('Rejects when user id doesn’t match with a user stored in the database (although the token and id are valid)', async () => {
        try {
            // Create a signed up user and get its user id
            const mockDataId = (await createSignedUpUser(usersPasswordPatchMockDataNotFound, undefined, true))._id.toString()
            // Sign a token with this user id, which is different than the id of mockDataUser
            const jwtToSend = signMockJWTUserSignin({ userId: mockDataId }, '30s') //Note: The expiration time is greater to avoid rejections for this cause
            // Delete the user from the database
            await deleteUser(usersPasswordPatchMockDataNotFound.email)

            const response = await supertest(app)
                .patch(`${route}/${mockDataId}`)
                .set('authorization', `Bearer ${jwtToSend}`)
                .send(mockPasswordChange)

            expect(response.status).toBe(404) //Not found
            expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String)
            })
        }
        finally {
            await deleteUser(usersPasswordPatchMockDataSecond.email)
        }
    })

    // ----------------------------- Grouping of wrong password and user not enabled status --------------------------------
    test.each([
        {
            mockData: usersPasswordPatchMockDataWrongPassword,
            mockUpdate: {
                ...mockPasswordChange,
                currentPassword: 'wrongPassword1*' // Current password is wrong
            },
            userStatus: undefined,
            testDescription: 'Rejects the current password is incorrect (wrong current password)',
            expectedRespStatus: 401, //The application uses a custom http response code
        },
        {
            mockData: usersPasswordPatchPendingMockData,
            mockUpdate: mockPasswordChange,
            userStatus: userStatus.pending,
            testDescription: 'Rejects when the user is in pending status',
            expectedRespStatus: 490, //The application uses a custom http response code
        },
        {
            mockData: usersPasswordPatchLockFailPwdMockData,
            mockUpdate: mockPasswordChange,
            userStatus: userStatus.lockedFailedLogin,
            testDescription: 'Rejects when the user is locked due to multiple failed signin attemps',
            expectedRespStatus: 491, //The application uses a custom http response code
        },
        {
            mockData: usersPasswordPatchNotEnbMockData,
            mockUpdate: mockPasswordChange,
            userStatus: 'Any status different from enabled',
            testDescription: 'Rejects when the user is a non-enabled status (any status different than enabled',
            expectedRespStatus: 403, //The application uses a custom http response code
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
                .patch(`${route}/${mockDataId}`)
                .set('authorization', `Bearer ${jwtToSend}`)
                .send(test.mockUpdate)
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
            const createdUser = (await createSignedUpUser(usersPasswordPatchMockDataSuccess, undefined, true))
            const mockDataId = createdUser._id.toString()
            const previousLastAccessOn = createdUser.lastAccessOn
            const previousUserDataUpdatedOn = createdUser.userDataUpdatedOn
            // Sign a token with this user id, which is different than the id of mockDataUser
            const jwtToSend = signMockJWTUserSignin({ userId: mockDataId }, '30s') //Note: The expiration time is greater to avoid rejections for this cause

            const response = await supertest(app)
                .patch(`${route}/${mockDataId}`)
                .set('authorization', `Bearer ${jwtToSend}`)
                .send(mockPasswordChange)

            expect(response.status).toBe(200) //Expects an Ok http response
            expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String),
            })

            /* 
            Delay a second to give a chance for the user's userDataUpdatedOn and lastAccessOn data 
            to update in the database, since these dates updates are asyncronous
            */
            await delay(delayTime)

            // Assert that the user's password was changed successfully
            const updatedUser = await usersFindDbUtils.userFindById(mockDataId)
            // Checkpassword
            expect(isPasswordValid(mockPasswordChange.newPassword, updatedUser.password)).toBeTruthy()

            // Assert that lastAccessDateOn was updated
            // Assert that the lastAccessOn is still a date type
            let isDate = isValidDate(updatedUser.lastAccessOn)
            expect(isDate).toBeTruthy()
            // Asert that userDataUpdatedOn is still a date type
            isDate = isValidDate(updatedUser.userDataUpdatedOn)
            expect(isDate).toBeTruthy()
            // Check that the last access date is updated
            const lastAccessDateWasUpdated = (updatedUser.lastAccessOn > previousLastAccessOn)
            expect(lastAccessDateWasUpdated).toBeTruthy()            
            // Check that the last access date is updated
            const userDataUpdatedOnWasUpdated = (updatedUser.userDataUpdatedOn > previousUserDataUpdatedOn)
            expect(userDataUpdatedOnWasUpdated).toBeTruthy()

        } finally {
            // Teardown Mock data regardless of test result
            await deleteUser(usersPasswordPatchMockDataSuccess.email)
        }
    })
})