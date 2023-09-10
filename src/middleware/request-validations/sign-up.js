const Validators = require('../../utils/validators/sign-up-req-schema')
const sendError = require('../../utils/res-error')
const { statusTxt } = require('../../config/parameters')

/* sign-up request body validation middleware
    (using register fields validation to login and
    resending the verification token also
    as the body is same for all)
*/
module.exports.validateSignUpFields = (req, res, next) => {
    //Validate request body schema 
    const { error } = Validators.signUpValidation(req.body)
    if (error) {
        sendError(400, statusTxt.statusFailed, error.details[0].message, null, res) //Pass the param 'error' as null to not share complete details about the error with the client. Only the error message is sent
        return 
    }
    //When pass all validation execute the next function in the pipeline
    next()
}
