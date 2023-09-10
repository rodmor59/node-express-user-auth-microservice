const mongoose = require('mongoose')
const supertest = require('supertest')

// Load environment variables
require('dotenv').config()
const app = require('../src/app')
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

beforeAll(() => {
    //await connectDB()
    mongoose.connect(process.env.DB_URI)
})

afterAll(() => {
    //Delete test data

    //Close DB Connection
    mongoose.connection.close()
})

describe('POST /sign-up', () => {

    test('should reject request if email is missing', async () => {
        const testSignUpData = {
            password: tstPassword, //Test data is missing the email field
            firstName: tstFirstName,
            lastName: tstLastName,
            receiveEmails: tstReceiveEmails
        }
        await supertest(app)
            .post(signUpRoute)
            .send(testSignUpData)
            .expect(400)
    })

    test('should reject request if email is not a string', () => {

    })

    test('should reject request if email format is invalid', () => {

    })

    test('should reject request if password is missing', () => {

    })

    test('should reject request if password is not a string', () => {

    })

    test('should reject request if the password format is invalid (Not strong enough)', () => {

    })

    test('should reject request if the first name is missing', () => {

    })

    test('should reject request if first name is not a string', () => {

    })

    test('should reject request if first name format is invalid', () => {

    })

    test('should reject request if the last name is missing', () => {

    })

    test('should reject request if last name is not a string', () => {

    })

    test('should reject request if the last name format is invalid', () => {

    })

    test('should reject request if the field "receiveEmails" is missing', () => {

    })

    test('should reject request if the field "receiveEmails" is not a boolean', () => {

    })

    test('should process request and return response in correct format when the received data is correct', () => {

    })

    test('should reject request if there is another user with the same email', async () => {
        try {
            //Setup test Data to be inserted into the DB
            const testSignUpData = {
                email: tstEmail,
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

            await supertest(app)
                .post(signUpRoute)
                .send(testSignUpData)
                .expect(409)
        }
        finally {
            // Cleanup test data preparations regardless of test result
            await UserModel.deleteOne({ email: tstEmail })
        }
    })
})