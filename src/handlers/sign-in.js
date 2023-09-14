const signinSrv = require('../services/sign-in')
const appParameters = require('../config/parameters')

//---- sign up user
module.exports.signin = async function (req, res, next) {
    try {
        //Destructure the request body
        const { email, password } = req.body
        
        //Call the Sign Up Service
        const usrSigninResult = await signinSrv.signin(email, password)

        //Send the response
        res.status(usrSigninResult.httpStatusCode).json(usrSigninResult.payload)
    }
    catch (error) {
        console.error(error)
        next({ error: error, message: appParameters.messages.msgErrSendToClient })
    }
}