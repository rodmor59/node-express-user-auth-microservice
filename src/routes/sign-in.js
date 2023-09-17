const express = require('express')
const router = express.Router()

// Import middleware functions
const ReqValidations = require('../middleware/request-validations/sign-in')
const { localAuthMiddleware } = require('../middleware/auth')
const signinHandler = require('../handlers/sign-in-success')

//const signinHandler = require('../handlers/sign-in')

console.log('Sign in routes loaded')

//---- routing to user sign-in (Login)
router.post(
    '/sign-in', 
    ReqValidations.validateSigninFields,
    localAuthMiddleware, //Since this is a sign-in route with username and password its only purpose is to authenticate and retur the token (It doesn't need to require further handling)
    signinHandler.signinSuccess
)

module.exports = router
