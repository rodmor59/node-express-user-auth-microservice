const encryptPwd = require('../utils/encrypt-pwd')
const { getUserByEmail } = require('./users')
const userDBService = require('./dbservices/user')
const { statusTxt, userStatus } = require('../config/parameters')

//Error messages
const errMsgDuplicateEmail = 'There is another user with the specified email'
const successMsgSignUp = 'New user signed up successfully'

//---- sign up user Service
module.exports.signup = async (userData) => {

    //Check that the email the new user has sent is not taken
    const user = await getUserByEmail(userData.email)
    if (user.success) {
        //There is a user with that email already
        return {
            success: false, //Notify the caller that the function was not successful
            httpStatusCode: 409, //Conflict httpStatus code, since there is a user with that email already
            payload: { //Data that will ultimately be sent to the client
                status: statusTxt.statusFailed,
                message: errMsgDuplicateEmail
            }
        }
    }

    //Encrypt password
    userData.password = await encryptPwd(userData.password)
    //Create the new user
    const newRegUser = await userDBService.create({
        ...userData,
        status: userStatus.enabled,
        failedLoginAttempts: 0,
        
    })

    //Send email to confirm user email address. Function called without await so the function continues processing while the email is sent

    //Success response
    return {
        success: true, //Notify the caller that the function was successful
        httpStatusCode: 200, //Give the caller the http response code to send to the client
        payload: { //Data that will ultimately be sent to the client
            status: statusTxt.statusCompleted,
            message: successMsgSignUp,
            newUserId: newRegUser._id
        }
    }
}