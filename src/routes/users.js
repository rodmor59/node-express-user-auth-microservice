const express = require('express')
const router = express.Router()

// Import middleware functions
const ReqValidations = require('../middleware/request-validations/users')
const { jwtAuthMiddleware } = require('../middleware/auth')
const usersHandler = require('../handlers/users')

//const signinHandler = require('../handlers/sign-in')

console.log('Sign in routes loaded')

//---- routing to user get
router.get(
    '/users/:id', 
    ReqValidations.validateUsersGet,
    jwtAuthMiddleware,
    usersHandler.usersGet 
)

module.exports = router