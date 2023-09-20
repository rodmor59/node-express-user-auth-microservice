const express = require('express')
const router = express.Router()

// Import middleware functions
const { tokenOpTypes } = require('../config/parameters')
const ReqValidations = require('../middleware/request-validations/users')
const { jwtAuthMiddleware } = require('../middleware/auth')
const usersHandler = require('../handlers/users')

console.log('users routes loaded')

router.get(
    '/users/:id', 
    ReqValidations.validateUsersParams, // Get validation only require to validate users params send as part of the route
    jwtAuthMiddleware(tokenOpTypes.signin, true), // Middleware will validate the id sent in the route param against the id encoded in the token
    usersHandler.usersGet 
)

router.patch(
    '/users/:id',
    ReqValidations.validateUsersParams, // Validate that the user id was sent as part of the route
    ReqValidations.validateUsersUpdate, // Validate that the body of the request is valid for an update operation
    jwtAuthMiddleware(tokenOpTypes.signin, true), // Middleware will validate the id sent in the route param against the id encoded in the token
    usersHandler.usersUpdate
)

module.exports = router