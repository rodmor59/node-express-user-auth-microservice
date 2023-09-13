const express = require('express')
const router = express.Router()
const ReqValidations = require('../middleware/request-validations/sign-in')
//const signUpHandler = require('../handlers/sign-up')

console.log('Sign in routes loaded')

//---- routing to user sign-ip (Logimn)
router.post(
    '/sign-in', 
    ReqValidations.validateSigninFields,
    //signUpHandler.signUp
)

module.exports = router
