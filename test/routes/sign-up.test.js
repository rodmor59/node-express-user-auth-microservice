const mongoose = require('mongoose')
const supertest = require('supertest')

// Load environment variables
require('dotenv').config()
const app = require('../../src/app')
const UserModel = mongoose.model('User') //For preparing and deleting test data directly in the DB

//URL Routes constants
const signUpRoute = '/sign-up'

//Constants for fields in test data
const tstEmail = 'test@example.com'
const tstPassword = 'pwdTst11*'
const tstFirstName = 'TestFirstName'
const tstLastName = 'TestLasttName'
const tstReceiveEmails = true
const tstUsrStatus = 'test'
//Constants for duplicate email test data. This test case uses a unique email
const tstDupEmail = 'testdup@example.com'

describe('POST /sign-up', () => {

    afterAll(async () => {
        /*
        The following line makes sure that the test data is deleted from the DB after finishing the suite.
        This is necessary because a test that should have rejected the request could have failed, allowing 
        the creation of the document. Therefore it must be deleted at the end of the suite.
    
        Test data for duplicate emails doesn't require this treatment as it is deleted within its test, as part
        of its test data preparations.
        */
        await UserModel.deleteOne({ email: tstEmail })
    
    })

    test('should reject request if email is missing', async () => {
        const testSignUpData = {
            password: tstPassword, //Test data is missing the email field
            firstName: tstFirstName,
            lastName: tstLastName,
            receiveEmails: tstReceiveEmails
        }    
        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should reject request if email is not a string', async () => {
        const testSignUpData = {
            email: true, //Email is set as a non string
            password: tstPassword,
            firstName: tstFirstName,
            lastName: tstLastName,
            receiveEmails: tstReceiveEmails
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should reject request if email format is invalid', async () => {

        const testSignUpData = {
            email: 'testexample.com', //Email is set in an invalid format (doesn't have the "@" character)
            password: tstPassword,
            firstName: tstFirstName,
            lastName: tstLastName,
            receiveEmails: tstReceiveEmails
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should reject request if password is missing', async () => {

        const testSignUpData = {
            email: tstEmail, //Password prop is missing
            firstName: tstFirstName,
            lastName: tstLastName,
            receiveEmails: tstReceiveEmails
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })

    })

    test('should reject request if password is not a string', async () => {
        const testSignUpData = {
            email: tstEmail,
            password: true, //Password is set as a non string
            firstName: tstFirstName,
            lastName: tstLastName,
            receiveEmails: tstReceiveEmails
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should reject request if the password format is invalid (Not strong enough)', async () => {
        const testSignUpData = {
            email: tstEmail,
            password: '123456', //Password is set to a non-strong value
            firstName: tstFirstName,
            lastName: tstLastName,
            receiveEmails: tstReceiveEmails
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should reject request if the first name is missing', async () => {
        const testSignUpData = {
            email: tstEmail,
            password: tstPassword, //First name prop is missing
            lastName: tstLastName,
            receiveEmails: tstReceiveEmails
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should reject request if first name is not a string', async () => {
        const testSignUpData = {
            email: tstEmail,
            password: tstPassword,
            firstName: true, //First name prop is set to a non-string value
            lastName: tstLastName,
            receiveEmails: tstReceiveEmails
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should reject request if first name format is invalid', async () => {
        const testSignUpData = {
            email: tstEmail,
            password: tstPassword,
            firstName: 'R*ich*ar~d==++', //First name is set to contain invalid characters for a name
            lastName: tstLastName,
            receiveEmails: tstReceiveEmails
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should reject request if the last name is missing', async () => {
        const testSignUpData = {
            email: tstEmail,
            password: tstPassword,
            firstName: tstFirstName, //Last name prop is missing
            receiveEmails: tstReceiveEmails
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should reject request if last name is not a string', async () => {
        const testSignUpData = {
            email: tstEmail,
            password: tstPassword,
            firstName: tstFirstName,
            lastName: true, //Last name prop set to a non-string value
            receiveEmails: tstReceiveEmails
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should reject request if the last name format is invalid', async () => {
        const testSignUpData = {
            email: tstEmail,
            password: tstPassword,
            firstName: tstFirstName,
            lastName: 'B*r~o123wn', //Last name prop set to include invalid characters for a name
            receiveEmails: tstReceiveEmails
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should reject request if the field "receiveEmails" is missing', async () => {
        const testSignUpData = {
            email: tstEmail,
            password: tstPassword,
            firstName: tstFirstName,
            lastName: tstLastName, //receiveEmails prop is missing
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should reject request if the field "receiveEmails" is not a boolean', async () => {
        const testSignUpData = {
            email: tstEmail,
            password: tstPassword,
            firstName: tstFirstName,
            lastName: tstLastName,
            receiveEmails: 'Not a boolean' //receiveEmails prop set to a non-boolean value
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String)
        })
    })

    test('should process request and return the response in the expected format when the received data is correct', async () => {
        const testSignUpData = {
            email: tstEmail,
            password: tstPassword,
            firstName: tstFirstName,
            lastName: tstLastName,
            receiveEmails: tstReceiveEmails //All props have values in the expected format
        }   

        const response = await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)

        expect(response.status).toBe(200) //Expects an Ok http response
        expect(response.body).toMatchObject({ //This assertion verifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
            status: expect.any(String),
            message: expect.any(String),
            newUserId: expect.any(String), //Note that this prop is not sent as respnse when the signup fails
        })
    })

    test('should reject request if there is another user with the same email', async () => {
        try {
            //Setup test Data to be inserted into the DB
            const testSignUpData = {
                email: tstDupEmail,
                password: tstPassword,
                firstName: tstFirstName,
                lastName: tstLastName,
                receiveEmails: tstReceiveEmails
            }

            //Data preparation steps (Insert testSignUpData directly into the db)
            await UserModel.create({
                ...testSignUpData,
                status: tstUsrStatus, //Not relevant for test but must pass it as the Schema requires it. Any string value will suffice.
                failedLoginAttempts: 0, //Not relevant for test but must pass it as the Schema requires it
                lastAccessDate: new Date(), //Not relevant for test but must pass it as the Schema requires it
                lastSuccessfulLoginDate: null //Not relevant for test but must pass it as the Schema requires it
            })

            const response = await supertest(app)
                .post(signUpRoute)
                .send(testSignUpData)

            expect(response.status).toBe(409) //Http status code "Conflict"
            expect(response.body).toMatchObject({ //This assertion varifies that the response in case of error is properly formed (In this case that it has an status and message props and they are strings)
                status: expect.any(String),
                message: expect.any(String)
            })
        }
        finally {
            // Cleanup test data preparations regardless of test result
            await UserModel.deleteOne({ email: tstDupEmail })
        }
    })
})