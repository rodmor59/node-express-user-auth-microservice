const supertest = require('supertest')

const app = require('../../src/app') //The app that will be tested.
const { signinMockData } = require('../fixtures/mock-data') //Test user data
const createUser = require('../fixtures/create-user') // Fixture
const deleteUser = require('../teardowns/delete-user') //Teardown

//URL Routes constants
const signinRoute = '/sign-ip'

// ---------------------------- POST /sign-up Tests ----------------------------------------------------

describe('POST /sign-in', () => {

    beforeAll(async () => {
        // Saves a Mock user to the database
        await createUser(signinMockData)
    
    })

    afterAll(async () => {
        // Deletes the mock user from the database
        await deleteUser(signinMockData.email)
    
    })

    // -------------- Grouping of Reject requests tests, since they share the same test function -------------------
    test.each([
        {
            testSigninData: {
                password: signinMockData.password, //Test data is missing the email field
            },
            testDescription: 'Rejects when the email is missing'
        },
    ])('$testDescription', async (testSigninData) => {
        const response = await supertest(app)
            .post(signinRoute)
            .send(testSigninData)
        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    // ----------------------------- End of reject request test grouping----------------------------------------------

    /*test('Accepts and process when the data is correct', async () => {

        const response = await supertest(app)
            .post(signUpRoute)
            .send(signupMockData)

        expect(response.status).toBe(200) //Expects an Ok http response
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String),
            newUserId: expect.any(String), //Note that this prop is not sent as respnse when the signup fails
        })

        // Cleanup test data created by the signup process. If the test fails this is not necessary (and doesn't execute because test is interrupted at error)
        await deleteUser(signupMockData.email)
    })*/
})