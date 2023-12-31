const passport = require('passport')

const { getUserById } = require('../services/users')
const checkUserAuthStatus = require('../services/auth/check-user-auth-status')
const checkUserPassword = require('../services/auth/check-user-password')
const { updateLastAccessOn } = require('../utils/user-updates')
const { statusTxt, messages } = require('../config/parameters')
const sendError = require('../utils/res-error')

//Constantes de mensajes
const errMsgNoTokenReceived = 'No token was received' 
const errMsgJWTAuthFail = 'Token authentication failed' 
const errMsgUserIdNoMatch = 'Token was not issued with the requested user id' 
const errMsgTokenOpTypeNoMatch = 'Invalid token for this operation'

module.exports = {
    localAuthMiddleware: (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, resultAuth, /*info*/) => {
            if (err) {
                console.error(err)
                return sendError(500, statusTxt.statusFailed, messages.msgErrSendToClient, null, res)
            }
            
            /*
            resultAuth is an object prepared by the signin auth service, which checks if the email corresponds to
            a valid user, the password matches and the user is in enabled status. All these checks are part of
            an standar username and password authentication Strategy.
            
            resultAuth includes a prop indicating if it was successful or not. In case of error, and the httpStatus
            code, which must be sent to the client with the response.
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

    jwtAuthMiddleware: (tokenOpType, idIsIncludedInParams = true) => {
        return (req, res, next) => {

            const authHeader = req.headers.authorization

            //Before authentication, check that the client sent the Authorization header
            if (!authHeader) {
                //Send an error
                return sendError(400, statusTxt.statusFailed, errMsgNoTokenReceived, null, res)
            }

            passport.authenticate('jwt', { session: false }, async (err, decodedToken, /*info*/) => {
                if (err) {
                    console.error(err)
                    return sendError(500, statusTxt.statusFailed, messages.msgInternalError, null, res)
                }
                if (!decodedToken) {
                    return sendError(401, statusTxt.statusFailed, errMsgJWTAuthFail, null, res)
                }

                /* Following a standard for a JWT authentication strategy, it only concern is validating
                the JWT token, including if its signature is valid, that its payload include the userId in an adecuate
                document id format.
    
                Following successful JWT authentication a series of additional non-token related checks are performed.
                */

                // The opType encoded in the token must match the opType which the middleware is being called
                if (tokenOpType !== decodedToken.opType) {
                    return sendError(401, statusTxt.statusFailed, errMsgTokenOpTypeNoMatch, null, res) // Token is not authorized for this opType
                }

                if (idIsIncludedInParams) { // Middleware function must has been called with param indicating to check id
                    // Checks that the userId included in the token's payload matches the id receives in the params
                    if (decodedToken.userId !== req.params.id) {
                        return sendError(401, statusTxt.statusFailed, errMsgUserIdNoMatch, null, res) // Token is not authorized for the user id send in the params
                    }
                }
                // Check that user id received in the token's payload is registered in the system
                const userCheck = await getUserById(decodedToken.userId)
                if (!userCheck.success) {
                    return sendError(userCheck.httpStatusCode, statusTxt.statusFailed, userCheck.payload.message, null, res)
                }
                // Sets a const with the user obtained fron the DB.
                const dbUser = userCheck.payload.user
                /* 
                A successful user access has ocurred.
                
                The following line uptades the user's last access date in the database. Also, it ubpdates the
                lastAccessOn the user object that we have loaded in memory, this saves another access to the 
                database to update the dbUser object.
                
                */
                dbUser.lastAccessOn = updateLastAccessOn(dbUser._id)
                // Check that the user is in enabled status
                const userStatusCheck = checkUserAuthStatus(dbUser) //Function must be called with the entire user object
                if (!userStatusCheck.success) {
                    // Return error
                    return sendError(userStatusCheck.httpStatusCode, statusTxt.statusFailed, userStatusCheck.payload.message, null, res)
                }
                // User has passed all checks
                req.user = dbUser //Pass to next with the name user instead of dbUser
                next()
            })(req, res, next)
        }
    },
    /* passwordAuthMiddleware: Middleware that checks the password only, must be executed after jwtAuthMiddleware to
    receive the user to check password against.
    */
    passwordAuthMiddleware: async (req, res, next) => {
        // Destructure the current password from the req body
        const { currentPassword } = req.body 

        // Destructure the user from the req object (Previous step is supposed to attach the user to the req object)
        const { user } = req

        if (!currentPassword || !user) { // An internal error must have ocurred since this function is supposed to receive these fields in the req object
            return sendError(500, statusTxt.statusFailed, messages.msgInternalError, null, res) // Wrong password
        }

        // Checks password
        const resultPasswordCheck = await checkUserPassword(currentPassword, user)
        if (!resultPasswordCheck.success) {
            updateLastAccessOn(user) // Checking the password here doesn't increase failed login attempts, since user is already logged in.
            return sendError(resultPasswordCheck.httpStatusCode, statusTxt.statusFailed, resultPasswordCheck.payload.message, null, res)
        }

        // Proceeds to the next function in the pipeline
        next()
    }
}