const Validators = require('../../utils/validators/sign-up')
const sendError = require('../../utils/res-error')
const { statusTxt } = require('../../config/parameters')

/* sign-up request body validation middleware
    (using register fields validation to login and
    resending the verification token also
    as the body is same for all)
*/
module.exports.validateSignupFields = (req, res, next) => {
    //Validate request body schema 
    const { error } = Validators.signupValidation(req.body)
    if (error) {
        return sendError(400, statusTxt.statusFailed, error.details[0].message, null, res) //Pass the param 'error' as null to not share complete details about the error with the client. Only the error message is sent
    }
    //When pass all validation execute the next function in the pipeline
    next()
}
