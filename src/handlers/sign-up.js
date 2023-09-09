const signUpSrv = require('../services/sign-up')
const appParameters = require('../config/parameters')

//---- sign up user
module.exports.signUp = async function (req, res, next) {
    try {
        //Destructure the request
        const userData = {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            receiveEmails: req.body.receiveEmails,
        }

        //Call the Sign Up Service
        const usrSignUpResult = await signUpSrv.signUp(userData)

        //Send the response
        res.status(usrSignUpResult.status).json({
            message: usrSignUpResult.message,
            payload: usrSignUpResult.payload
        })
    }
    catch (error) {
        console.error(error)
        next({ error: error, message: appParameters.messages.msgErrSendToClient })
    }
}