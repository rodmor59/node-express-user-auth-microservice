const signupSrv = require('../services/sign-up')
const appParameters = require('../config/parameters')

//---- sign up user
module.exports.signup = async function (req, res, next) {
    try {
        //Destructure the request body
        const userData = {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            receiveEmails: req.body.receiveEmails,
        }

        //Call the Sign Up Service
        const usrSignUpResult = await signupSrv.signup(userData)

        //Send the response
        res.status(usrSignUpResult.httpStatusCode).json(usrSignUpResult.payload)
    }
    catch (error) {
        console.error(error)
        next({ error: error, message: appParameters.messages.msgErrSendToClient })
    }
}