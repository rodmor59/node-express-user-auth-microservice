const { usersParamValidation } = require('../../utils/validators/users')
const sendError = require('../../utils/res-error')
const { statusTxt } = require('../../config/parameters')

module.exports = {
    validateUsersGet: (req, res, next) => {
        //Users get doesn't send data in the body, the only validation required is that of the user id sent as part of the route
        const { error } = usersParamValidation(req.params)
        if (error ) {
            return sendError(400, statusTxt.statusFailed, error.details[0].message, null, res) //Pass the param 'error' as null to avoid sharing the complete details about the error with the client. Only the error message is sent
        }
        //When pass all validation execute the next function in the pipeline
        next()
    }
}