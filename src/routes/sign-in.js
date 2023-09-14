const express = require('express')
const router = express.Router()
const ReqValidations = require('../middleware/request-validations/sign-in')
const signinHandler = require('../handlers/sign-in')

console.log('Sign in routes loaded')

//---- routing to user sign-ip (Logimn)
router.post(
    '/sign-in', 
    ReqValidations.validateSigninFields,
    signinHandler.signin
)

module.exports = router
