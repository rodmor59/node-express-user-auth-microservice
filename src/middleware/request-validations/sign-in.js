const Validators = require('../../utils/validators/validate-req-sign-in')
const sendError = require('../../utils/res-error')
const { statusTxt } = require('../../config/parameters')

module.exports.validateSigninFields = (req, res, next) => {
    //Validate request body schema 
    const { error } = Validators.signinValidation(req.body)
    if (error) {
        sendError(400, statusTxt.statusFailed, error.details[0].message, null, res) //Pass the param 'error' as null to avoid sharing the complete details about the error with the client. Only the error message is sent
        return 
    }
    //When pass all validation execute the next function in the pipeline
    next()
}
