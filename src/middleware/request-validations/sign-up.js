const Validators = require('../../utils/validators/sign-up-req-schema')
const sendError = require('../../utils/res-error')

//String constants
const failedStatus = 'failed'

/* sign-up request body validation middleware
    (using register fields validation to login and
    resending the verification token also
    as the body is same for all)
*/
module.exports.validateSignUpFields = (req, res, next) => {
    //Validate request body schema 
    const { error } = Validators.signUpValidation(req.body)
    if (error) {
        sendError(400, failedStatus, error.details[0].message, error, res)
        return 
    }
    //When pass all validation execute the next function in the pipeline
    next()
}
