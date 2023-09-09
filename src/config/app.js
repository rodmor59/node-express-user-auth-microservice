//CORS Function
module.exports.customCors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
}

// Custom function for Error Handling
module.exports.customErrorHandler = function ({error, message}, request, response) {
    // Error handling middleware functionality
    console.log(`error ${error.message}`)
    const status = error.status || 400
    // send back an easily understandable error message to the caller
    response.status(status).send(message)
}