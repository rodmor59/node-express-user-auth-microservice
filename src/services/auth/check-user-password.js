const {
    numWrongPwdAttemptsToLockUser,
    statusTxt,
    userStatus
} = require('../../config/parameters')
const isPasswordValid = require('../../utils/check-password')

//Consts messages
const errMsgWrongPwd = 'Incorrect password'

//Cheks user password and uptates user failed logins attempts and status
const checkUserPassword = async (passwordToCheck, user) => {
    const validPassword = await isPasswordValid(passwordToCheck, user.password)
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
    return {
        success: true
    }
}

//Default export
module.exports = checkUserPassword