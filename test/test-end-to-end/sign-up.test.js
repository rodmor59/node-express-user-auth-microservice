const supertest = require('supertest')

const app = require('../../src/app') //The app that will be tested.
const { signupMockData, signupDupEmailMockData } = require('../fixtures/mock-data') //Test user data
const createUser = require('../fixtures/create-user') // Fixture
const deleteUser = require('../teardowns/delete-user') //Teardown

//URL Routes constants
const signUpRoute = '/sign-up'

// ---------------------------- POST /sign-up Tests ----------------------------------------------------

describe('POST /sign-up', () => {

    afterAll(async () => {
        /*
        The following line executes a tear down of the signup Mock Data.

        It is necessary to do it here because a test that should have rejected the request could have failed, 
        allowing the creation of the document. Therefore it must be deleted at the end of the suite.
    
        Mock data for successful signups and signups with duplicate emails doesn't require this treatment 
        as their mock data is teared down within the test function.
        */
        await deleteUser(signupMockData.email)
    
    })

    // -------------- Grouping of Reject requests tests, since they share the same test function -------------------
    test.each([
        {
            testSignUpData: {
                password: signupMockData.password, //Test data is missing the email field
                firstName: signupMockData.firstName,
                lastName: signupMockData.lastName,
                receiveEmails: signupMockData.receiveEmails
            },
            testDescription: 'Rejects when the email is missing'
        },
        {
            testSignUpData: {
                ...signupMockData,
                email: true //Email is set as a non string
            },
            testDescription: 'Rejects when email is not a string'
        },
        {
            testSignUpData: {
                ...signupMockData,
                email: 'testexample.com' //Email is set in an invalid format (doesn't have the "@" character)
            },   
            testDescription: 'Rejects when email format is invalid'
        },
        {
            testSignUpData: {
                email: signupMockData.email, //Password prop is missing
                firstName: signupMockData.firstName,
                lastName: signupMockData.lastName,
                receiveEmails: signupMockData.receiveEmails
            },   
            testDescription: 'Rejects when password is missing'
        },
        {
            testSignUpData: {
                ...signupMockData,
                password: true //Password is set as a non string
            },   
            testDescription: 'Rejects when password is not a string'
        },
        {
            testSignUpData: {
                ...signupMockData,
                password: '123456' //Weak password
            },   
            testDescription: 'Rejects when the password format is invalid (Not strong enough)'
        },
        {
            testSignUpData: {
                email: signupMockData.email,
                password: signupMockData.password, //First name prop is missing
                lastName: signupMockData.lastName,
                receiveEmails: signupMockData.receiveEmails
            },   
            testDescription: 'Rejects when the first name is missing'
        },
        {
            testSignUpData: {
                ...signupMockData,
                firstName: true, //First name prop is set to a non-string value
            },   
            testDescription: 'Rejects when the first name is not a string'
        },
        {
            testSignUpData: {
                ...signupMockData,
                firstName: 'R*ich*ar~d==++', //First name is set to contain invalid characters for a name
            },   
            testDescription: 'Rejects when the first name format is invalid'
        },
        {
            testSignUpData: {
                email: signupMockData.email,
                password: signupMockData.password,
                firstName: signupMockData.firstName, //Last name prop is missing
                receiveEmails: signupMockData.receiveEmails
            },   
            testDescription: 'Rejects when the the last name is missing'
        },
        {
            testSignUpData: {
                ...signupMockData,
                lastName: true, //Last name prop set to a non-string value
            },   
            testDescription: 'Rejects when the last name is not a string'
        },
        {
            testSignUpData: {
                ...signupMockData,
                lastName: 'B*r~o123wn', //Last name prop set to include invalid characters for a name
            },   
            testDescription: 'Rejects when the last name format is invalid'
        },
        {
            testSignUpData: {
                email: signupMockData.email,
                password: signupMockData.password,
                firstName: signupMockData.firstName,
                lastName: signupMockData.lastName, //receiveEmails prop is missing
            },   
            testDescription: 'Rejects when the field "receiveEmails" is missing'
        },
        {
            testSignUpData: {
                ...signupMockData,
                receiveEmails: 'Not a boolean' //receiveEmails prop set to a non-boolean value
            },   
            testDescription: 'Rejects when the field "receiveEmails" is not a boolean'
        },
    ])('$testDescription', async (testSignUpData) => {
        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)
        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })
    // ----------------------------- End of reject request test grouping----------------------------------------------

    test('Accepts and process when the data is correct', async () => {

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
    })

    test('Rejects when there is another user with the same email', async () => {
        try {
            /*
            Fixture steps (Insert testSignUpData directly into the db)*
            Note: Password is inserted without encryption but that is not relevant for this test as it validates
            duplicate email only.
            */
            await createUser(signupDupEmailMockData)
            
            const response = await supertest(app)
                .post(signUpRoute)
                .send(signupDupEmailMockData)

            expect(response.status).toBe(409) //Http status code "Conflict"
            expect(response.body).toMatchObject({ //This assertion varifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String)
            })
        }
        finally {
            // Teardown Mock data regardless of test result
            await deleteUser(signupDupEmailMockData.email)
        }
    })
})