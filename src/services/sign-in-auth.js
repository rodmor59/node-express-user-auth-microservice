const userDBService = require('./dbservices/user')
const { customHttpResponseCodes,
    numWrongPwdAttemptsToLockUser,
    statusTxt,
    userStatus
} = require('../config/parameters')
const isPasswordValid = require('../utils/check-password')
const updateUserDates = require('../utils/user-dates-update')

//Error messages
const errMsgUserNoExist = 'There is no user with the specified email'
const errMsgUserPendingEmailConf = 'User is not-enabled pending email confirmation'
const errMsgUserNotLockFailedSigin = 'User is locked due to repeated attempts at signing with the wrong password'
const errMsgUserNotEnabled = 'User is in a not-enabled status'
const errMsgWrongPwd = 'Incorrect password'
const successMsgSignin = 'User signed in successfully'

//---- service that authenticate users checking username, password and if the user is not locked
module.exports.authentication = async (email, password) => {

    //Check that there is a user with the specified email
    const user = await userDBService.findOneByEmail(email)
    if (!user) {
        return {
            success: false, //Notify the caller that the function was not successful
            httpStatusCode: 401, //Notify the caller why the function was not successful in the form of an httpErrorCode that it can pass to the client
            payload: { //Data that will ultimately be sent to the client
                status: statusTxt.statusFailed,
                message: errMsgUserNoExist
            }
        }
    }

    //Update user last Access date at thos point (A successful access ocurred)
    updateUserDates.lastAccessDate(user._id)

    //Check if user is on pending status (Has not confirmed his email address yet)
    if (user.status === userStatus.pending) {
        return {
            success: false, //Notify the caller that the function was not successful
            httpStatusCode: customHttpResponseCodes.userPendingStatus, //Notify the caller why the function was not successful in the form of an httpErrorCode that it can pass to the client
            payload: { //Data that will ultimately be sent to the client
                status: statusTxt.statusFailed,
                message: errMsgUserPendingEmailConf
            }
        }
    }

    //Check if user is locked due to repeated failed signin attemps
    if (user.status === userStatus.lockedFailedLogin) {
        return {
            success: false, //Notify the caller that the function was not successful
            httpStatusCode: customHttpResponseCodes.userLockedFailedLogin, //Apply a 'forbidden' http responde code (User exist but corrently is forbidden to access any resource)
            payload: { //Data that will ultimately be sent to the client
                status: statusTxt.statusFailed,
                message: errMsgUserNotLockFailedSigin
            }
        }
    }

    //Check if user is in other status different than 'enabled'
    if (user.status !== userStatus.enabled) {
        return {
            success: false, //Notify the caller that the function was not successful
            httpStatusCode: 403, //Apply a 'forbidden' http responde code (User exist but corrently is forbidden to access any resource)
            payload: { //Data that will ultimately be sent to the client
                status: statusTxt.statusFailed,
                message: errMsgUserNotEnabled
            }
        }
    }

    //Check that the password is correct
    const validPassword = await isPasswordValid(password, user.password)
    if (!validPassword) {
        //Adds one failed signin attempt
        user.failedLoginAttempts++
        //If user has reached the limit of failed attempts, its status must change to lockedFailedLogin
        if (user.failedLoginAttempts === numWrongPwdAttemptsToLockUser) {
            user.status = userStatus.lockedFailedLogin
        }
        user.save() //Save changes to user
        return {
            success: false, //Notify the caller that the function was not successful
            httpStatusCode: 401, //Notify the caller why the function was not successful in the form of an httpErrorCode that it can pass to the client
            payload: { //Data that will ultimately be sent to the client
                status: statusTxt.statusFailed,
                message: errMsgWrongPwd
            }
        }
    }

    //When password is correct, update the number fo failed attempts to cero
    user.failedLoginAttempts
    user.save() //Save changes to user

    //Sucess!
    return {
        success: true, //Notify the caller that the function was successful
        httpStatusCode: 200, //Give the caller the http response code to send to the client
        payload: { //Data that will ultimately be sent to the client
            status: statusTxt.statusCompleted,
            message: successMsgSignin,
            userInfo: { _id: user._id }
        }
    }
}