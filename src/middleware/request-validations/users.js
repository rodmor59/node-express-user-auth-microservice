const { usersParamValidation, usersUpdateValidation } = require('../../utils/validators/users')
const sendError = require('../../utils/res-error')
const { statusTxt } = require('../../config/parameters')

module.exports = {
    validateUsersParams: (req, res, next) => {
        // Check that user id was sent as part of the route
        const { error } = usersParamValidation(req.params) // Must call functions with the request parameters
        if (error ) {
            return sendError(400, statusTxt.statusFailed, error.details[0].message, null, res) //Pass the param 'error' as null to avoid sharing the complete details about the error with the client. Only the error message is sent
        }
        //When pass all validation execute the next function in the pipeline
        next()
    },
    validateUsersUpdate: (req, res, next) => {
        // Validate request body schema for a user update
        const { error } = usersUpdateValidation(req.body) // Must call the function with the request body
        if (error ) {
            return sendError(400, statusTxt.statusFailed, error.details[0].message, null, res) //Pass the param 'error' as null to avoid sharing the complete details about the error with the client. Only the error message is sent
        }
        //When pass all validation execute the next function in the pipeline
        next()
    }
}