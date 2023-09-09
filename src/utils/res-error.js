//Function to respond to the http Client with an error.
const sendError = (httpErrCode, statusTxt, message, error, res) => {
    return res.status(httpErrCode).json({
        status: statusTxt,
        message: message,
        error: error,
    })
}

//Default export
module.exports = sendError