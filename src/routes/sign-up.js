const express = require('express')
const router = express.Router()
const ReqValidations = require('../middleware/request-validations/sign-up')
const signUpHandler = require('../handlers/sign-up')

console.log('Sign Up routes loaded')

//---- routing to user sign-up (Registration)
router.post(
    '/sign-up', 
    ReqValidations.validateSignUpFields,
    signUpHandler.signUp
)

module.exports = router
