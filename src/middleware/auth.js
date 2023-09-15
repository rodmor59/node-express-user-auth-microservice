const passport = require('passport')

const appParameters = require('../config/parameters')

module.exports = {
    localAuthMiddleware: (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, resultAuth, /*info*/) => {
            if (err) {
                console.error(err)
                next({ error: err, message: appParameters.messages.msgErrSendToClient })
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
        passport.authenticate('jwt', { session: false }, (err, user, /*info*/) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed' })
            }
            req.user = user
            next()
        })(req, res, next)
    },
}