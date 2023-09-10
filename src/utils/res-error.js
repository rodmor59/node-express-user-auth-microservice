/*
Function to respond to the http Client with an error.

Handles expected errors raised by middlewares or handlers.

*/
const sendError = (httpStatusCode, statusTxt, message, error, res) => {
    //Prepare object with the status, message and error to send
    let errData = {
        status: statusTxt,
        message: message
    }
    /*Verifies if a complete error was sent as a param, if it was sent it adds it to errData, if not it does nothing
    This lets developers control if the want to share with the client complete information about the error or not.
    
    To avoid sharing details about the error, just pass the error as null when calling this function
    */
    if (error) {
        errData = {
            ...errData,
            error: error,
        }
    }

    return res.status(httpStatusCode).json(errData)
}

//Default export
module.exports = sendError