const supertest = require('supertest')

const app = require('../../src/app')
const { testUserData, testDupUserData } = require('../test-data-def') //Test user data
const { createTestUser, deleteTestUser } = require('../test-data-prep-utils') // DB Access utils for setting up test data

//URL Routes constants
const signUpRoute = '/sign-up'

// ---------------------------- POST /sign-up Tests ----------------------------------------------------

describe('POST /sign-up', () => {

    afterAll(async () => {
        /*
        The following line makes sure that the test data is deleted from the DB after finishing the suite.
        This is necessary because a test that should have rejected the request could have failed, allowing 
        the creation of the document. Therefore it must be deleted at the end of the suite.
    
        Test data for duplicate emails doesn't require this treatment as it is deleted within its test, regardless
        of wether the test fails or not.
        */
        await deleteTestUser(testUserData.email)
    
    })

    // -------------- Grouping of Reject requests tests, since they share the same test function -------------------
    test.each([
        {
            testSignUpData: {
                password: testUserData.password, //Test data is missing the email field
                firstName: testUserData.firstName,
                lastName: testUserData.lastName,
                receiveEmails: testUserData.receiveEmails
            },
            testDescription: 'Rejects when the email is missing'
        },
        {
            testSignUpData: {
                ...testUserData,
                email: true //Email is set as a non string
            },
            testDescription: 'Rejects when email is not a string'
        },
        {
            testSignUpData: {
                ...testUserData,
                email: 'testexample.com' //Email is set in an invalid format (doesn't have the "@" character)
            },   
            testDescription: 'Rejects when email format is invalid'
        },
        {
            testSignUpData: {
                email: testUserData.email, //Password prop is missing
                firstName: testUserData.firstName,
                lastName: testUserData.lastName,
                receiveEmails: testUserData.receiveEmails
            },   
            testDescription: 'Rejects when password is missing'
        },
        {
            testSignUpData: {
                ...testUserData,
                password: true //Password is set as a non string
            },   
            testDescription: 'Rejects when password is not a string'
        },
        {
            testSignUpData: {
                ...testUserData,
                password: '123456' //Weak password
            },   
            testDescription: 'Rejects when the password format is invalid (Not strong enough)'
        },
        {
            testSignUpData: {
                email: testUserData.email,
                password: testUserData.password, //First name prop is missing
                lastName: testUserData.lastName,
                receiveEmails: testUserData.receiveEmails
            },   
            testDescription: 'Rejects when the first name is missing'
        },
        {
            testSignUpData: {
                ...testUserData,
                firstName: true, //First name prop is set to a non-string value
            },   
            testDescription: 'Rejects when the first name is not a string'
        },
        {
            testSignUpData: {
                ...testUserData,
                firstName: 'R*ich*ar~d==++', //First name is set to contain invalid characters for a name
            },   
            testDescription: 'Rejects when the first name format is invalid'
        },
        {
            testSignUpData: {
                email: testUserData.email,
                password: testUserData.password,
                firstName: testUserData.firstName, //Last name prop is missing
                receiveEmails: testUserData.receiveEmails
            },   
            testDescription: 'Rejects when the the last name is missing'
        },
        {
            testSignUpData: {
                ...testUserData,
                lastName: true, //Last name prop set to a non-string value
            },   
            testDescription: 'Rejects when the last name is not a string'
        },
        {
            testSignUpData: {
                ...testUserData,
                lastName: 'B*r~o123wn', //Last name prop set to include invalid characters for a name
            },   
            testDescription: 'Rejects when the last name format is invalid'
        },
        {
            testSignUpData: {
                email: testUserData.email,
                password: testUserData.password,
                firstName: testUserData.firstName,
                lastName: testUserData.lastName, //receiveEmails prop is missing
            },   
            testDescription: 'Rejects when the field "receiveEmails" is missing'
        },
        {
            testSignUpData: {
                ...testUserData,
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
            .send(testUserData)

        expect(response.status).toBe(200) //Expects an Ok http response
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String),
            newUserId: expect.any(String), //Note that this prop is not sent as respnse when the signup fails
        })

        // Cleanup test data created by the signup process. If the test fails this is not necessary (and doesn't execute because test is interrupted at error)
        await deleteTestUser(testUserData.email)
    })

    test('Rejects when there is another user with the same email', async () => {
        try {
            //Data preparation steps (Insert testSignUpData directly into the db)
            await createTestUser(testDupUserData)
            
            const response = await supertest(app)
                .post(signUpRoute)
                .send(testDupUserData)

            expect(response.status).toBe(409) //Http status code "Conflict"
            expect(response.body).toMatchObject({ //This assertion varifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String)
            })
        }
        finally {
            // Cleanup test data preparations regardless of test result
            await deleteTestUser(testDupUserData.email)
        }
    })
})