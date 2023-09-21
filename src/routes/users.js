const express = require('express')
const router = express.Router()

// Import middleware functions
const { tokenOpTypes } = require('../config/parameters')
const ReqValidations = require('../middleware/request-validations/users')
const { jwtAuthMiddleware, passwordAuthMiddleware } = require('../middleware/auth')
const userHandlers = require('../handlers/users')

console.log('users routes loaded')

// --------------- Endpoint: Get user data --------------------
router.get(
    '/users/:id', 
    ReqValidations.validateUsersParams, // Get validation only require to validate users params send as part of the route
    jwtAuthMiddleware(tokenOpTypes.signin, true), // Route is protected by jwtAuth middleware with signin operation
    userHandlers.get
)

// --------------- Endpoint: Edit user's first name, last name and receiveEmails status --------------------
router.patch(
    '/users/:id',
    ReqValidations.validateUsersParams, // Validate that the user id was sent as part of the route
    ReqValidations.validateUsersUpdate, // Validate that the body of the request is valid for an update operation
    jwtAuthMiddleware(tokenOpTypes.signin, true), // Route is protected by jwtAuth middleware with signin operation
    userHandlers.update
)

// --------------- Endpoint: Change user's password --------------------
router.patch(
    '/users/password/:id',
    ReqValidations.validateUsersParams, // Validate that the user id was sent as part of the route
    ReqValidations.validateChangePassword, // Validate that the user id was sent as part of the route
    jwtAuthMiddleware(tokenOpTypes.signin, true), // Route is protected by jwtAuth middleware with signin operation
    passwordAuthMiddleware, // Extra security step for changing password, user must send the current password again, even toguh he has a signin token
    userHandlers.changePassword
)

module.exports = router