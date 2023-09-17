const userDBService = require('./dbservices/user')
const { statusTxt } = require('../config/parameters')

//Error messages
const errMsgUserEmailNoExist = 'There is no user with the specified email'
const errMsgUserIdNoExist = 'There is no user with the specified id'
const successMsgUserGet = 'User was found'

const getUserById = async (id) => {
    //Check that there is a user with the specified email
    const user = await userDBService.findById(id)
    if (!user) {
        return {
            success: false, //Notify the caller that the function was not successful
            httpStatusCode: 404, //Notify the caller why the function was not successful in the form of an httpErrorCode that it can pass to the client
            payload: { //Data that will ultimately be sent to the client
                status: statusTxt.statusFailed,
                message: errMsgUserIdNoExist
            }
        }
    }
    //If reached this point, user do exist

    return {
        success: true, //Notify the caller that the function was successful
        httpStatusCode: 200, //Give the caller the http response code to send to the client
        payload: { //Data that will ultimately be sent to the client
            status: statusTxt.statusCompleted,
            message: successMsgUserGet,
            user: user
        }
    }
}

const getUserByEmail = async (email) => {
    //Check that there is a user with the specified email
    const user = await userDBService.findOneByEmail(email)
    if (!user) {
        return {
            success: false, //Notify the caller that the function was not successful
            httpStatusCode: 404, // User not found
            payload: { //Data that will ultimately be sent to the client
                status: statusTxt.statusFailed,
                message: errMsgUserEmailNoExist
            }
        }
    }
    //If reached this point user do exist

    return {
        success: true, //Notify the caller that the function was successful
        httpStatusCode: 200, //Give the caller the http response code to send to the client
        payload: { //Data that will ultimately be sent to the client
            status: statusTxt.statusCompleted,
            message: successMsgUserGet,
            user: user
        }
    }
}

module.exports = {
    getUserById,
    getUserByEmail
}