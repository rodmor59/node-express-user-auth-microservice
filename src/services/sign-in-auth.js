const { getUserByEmail } = require('./users')
const checkUserAuthStatus = require('./auth/check-user-auth-status')
const checkUserPassword = require('./auth/check-user-password')
const { increaseFailedLoginAttempts, updateLastAccessOn, updateSuccessfulLogin } = require('../utils/user-updates')
const { statusTxt } = require('../config/parameters')

//Error messages
const successMsgSignin = 'User signed in successfully'

//---- service that authenticate users checking username, password and if the user is not locked
module.exports.authentication = async (email, password) => {

    //Check that the email sing corresponds with a user registered in the system
    const userCheck = await getUserByEmail(email)
    if (!userCheck.success) {
        //No user with that email
        return {
            ...userCheck,
            httpStatusCode: 401 // getUserByEmail returns 404 when user is not found, here change it to 401 to reflect that we are in the sign-in process, not getting a user resource
        }
    }

    //Assign the userCheck payload to a constant
    const user = userCheck.payload.user

    //Update user last Access date at this point (A successful access ocurred)
    updateLastAccessOn(user._id)

    //Check user status
    const userStatusCheckResult = checkUserAuthStatus(user)

    if (!userStatusCheckResult.success) {
        return userStatusCheckResult 
    }

    //Check the password
    const resultPasswordCheck = await checkUserPassword(password, user)
    if (!resultPasswordCheck.success) {
        increaseFailedLoginAttempts(user) //Increases the failed logins attempts before exiting
        return resultPasswordCheck
    }

    // At this point user has complied will all requisites for a successful sign in
    // Update the failid login attempts to zero and the last date of successful login
    updateSuccessfulLogin(user._id)

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