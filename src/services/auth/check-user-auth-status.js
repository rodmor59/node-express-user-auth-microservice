const { customHttpResponseCodes, statusTxt, userStatus} = require('../../config/parameters')

//Const error messages
const errMsgUserPendingEmailConf = 'User is not-enabled pending email confirmation'
const errMsgUserNotLockFailedSigin = 'User is locked due to repeated attempts at signing with the wrong password'
const errMsgUserNotEnabled = 'User is in a not-enabled status'
const SuccessMsg = 'User status is enabled'

//checkUserAuthStatus must receive a user object obtained from the database
const checkUserAuthStatus = (user) => {

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

    //If any of the conditions where met, return success
    return {
        success: true, //Notify the caller that the function was not successful
        httpStatusCode: 200,
        payload: { //Success information
            status: statusTxt.statusCompleted,
            message: SuccessMsg
        }
    }
}

//Default export
module.exports = checkUserAuthStatus