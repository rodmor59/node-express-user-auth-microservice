const encryptPwd = require('../utils/encrypt-pwd')
const userDBService = require('./dbservices/user')
const appParameters = require('../config/parameters')

//Error messages
const errMsgDuplicateEmail = 'There is another user with the specified email'
const successMsgSignUp = 'New user signed up successfully'

//---- sign up user Service
module.exports.signUp = async (userData) => {

    //Check that the email the new user has sent is not taken
    const user = await userDBService.findOneByEmail(userData.email)
    if (user !== null) {
        return {
            success: false,
            status: 409,
            message: errMsgDuplicateEmail
        }
    }

    //Get the current date
    const nowDate = new Date()
    //Encrypt password
    userData.password = await encryptPwd(userData.password)
    //Create the new user
    const newRegUser = await userDBService.create({
        ...userData,
        status: appParameters.userStatus.enabled,
        failedLoginAttempts: 0,
        lastAccessDate: nowDate,
        lastSuccessfulLoginDate: null
    })

    //Send email to confirm user email address. Function called without await so the function continues processing while the email is sent

    //Success response
    return {
        success: true,
        status: 200,
        message: successMsgSignUp,
        payload: {newRegUserId: newRegUser._id}
    }
}