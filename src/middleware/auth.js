const passport = require('passport')

const { statusTxt, messages } = require('../config/parameters')
const sendError = require('../utils/res-error')

//Constantes de mensajes
const errMsgNoTokenReceived = 'No token was received' 
const errMsgJWTAuthFail = 'Token authentication failed' 
const errMsgUserIdNoMatch = 'Token was not issued with the requested user id' 

module.exports = {
    localAuthMiddleware: (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, resultAuth, /*info*/) => {
            if (err) {
                console.error(err)
                return sendError(500, statusTxt.statusFailed, messages.msgErrSendToClient, null, res)
            }
            
            /*resultAuth is an object prepared by the signin auth service that include a prop indicating
            if it was successful or not, the httpStatys code that must be sent and a message. 
            In case of not successful this status code and a message is sent to the client.
            */
            if (!resultAuth.success) {
                //Was not successful
                return res.status(resultAuth.httpStatusCode).json(resultAuth.payload)
            }

            /*Authorization was successful: Attach the payload, which includes the user information, to the
            request object and call next() to proceed to the next function in the pipeline. The payload
            includes a prop called userInfo, which has the information necessary to issue the token (Which
            the next function in the pipeline will handle) */
            req.resultAuth = resultAuth
            next()
        })(req, res, next)
    },

    jwtAuthMiddleware: (req, res, next) => {

        const authHeader = req.headers.authorization

        //Before authentication, check that the client sent the Authorization header
        if (!authHeader){
            //Send an error
            return sendError(400, statusTxt.statusFailed, errMsgNoTokenReceived, null, res)
        }

        passport.authenticate('jwt', { session: false }, (err, user, /*info*/) => {
            if (err) {
                console.error(err)
                return sendError(500, statusTxt.statusFailed, messages.msgInternalError, null, res)
            }
            if (!user) {
                return sendError(401, statusTxt.statusFailed, errMsgJWTAuthFail, null, res)
            }

            // user was received. Additonal non-token related checks applied
            // The userId of the token payload must match the id receives in the params
            if (user.userId !== req.params.id){
                return sendError(400, statusTxt.statusFailed, errMsgUserIdNoMatch, null, res)
            }
            // User related validations (Must exist in the database and must be active)

            req.user = user
            next()
        })(req, res, next)
    },
}