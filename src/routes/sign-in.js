const express = require('express')
const router = express.Router()

// Import middleware functions
const { tokenOpTypes } = require('../config/parameters')
const ReqValidations = require('../middleware/request-validations/sign-in')
const { localAuthMiddleware, jwtAuthMiddleware } = require('../middleware/auth')
const signinHandler = require('../handlers/sign-in')

console.log('Sign in routes loaded')

//---- routing to user sign-in (Login)
router.post(
    '/sign-in',
    ReqValidations.validateSigninFields,
    localAuthMiddleware, //Since this is a sign-in route with username and password its only purpose is to authenticate and retur the token (It doesn't require further handling)
    signinHandler.signinSuccess
)

//---- routing to allow other microservices or applicaitons to check the validity of issued sign-in tokens
router.get(
    '/sign-in/check-auth', // This route doesn't receive params or body, only the token to validate in the header
    jwtAuthMiddleware(tokenOpTypes.signin, false), // Middleware will not check that the user id is send in the route params, as this route doesn't requires require it
    signinHandler.checkAuthSuccess
)

module.exports = router
