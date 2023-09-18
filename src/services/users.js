const userDBService = require('./dbservices/user')
const { statusTxt } = require('../config/parameters')

//Error messages
const errMsgUserEmailNoExist = 'There is no user with the specified email'
const errMsgUserIdNoExist = 'There is no user with the specified id'
const successMsgUserGet = 'User was found'

const getUserById = async (id) => {
    //Check that there is a user with the specified email
    const user = await userDBService.findById(id)
    return checkUserExistsAndReturn(user, errMsgUserIdNoExist, successMsgUserGet)
}

const getUserByEmail = async (email) => {
    //Check that there is a user with the specified email
    const user = await userDBService.findOneByEmail(email)
    return checkUserExistsAndReturn(user, errMsgUserEmailNoExist, successMsgUserGet)
}

const checkUserExistsAndReturn = (user, errMsgNoExist, successMsg) => { //This function is not exported
    if (!user) {
        return {
            success: false, //Notify the caller that the function was not successful
            httpStatusCode: 404, // User not found
            payload: { //Data that will ultimately be sent to the client
                status: statusTxt.statusFailed,
                message: errMsgNoExist
            }
        }
    }
    //If reached this point user do exist

    // Convert the user object to a plain JavaScript object
    const userData = user.toObject()

    return {
        success: true, //Notify the caller that the function was successful
        httpStatusCode: 200, //Give the caller the http response code to send to the client
        payload: { //Data that will ultimately be sent to the client
            status: statusTxt.statusCompleted,
            message: successMsg,
            user: userData //Returns only the data
        }
    }
}

module.exports = {
    getUserById,
    getUserByEmail
}