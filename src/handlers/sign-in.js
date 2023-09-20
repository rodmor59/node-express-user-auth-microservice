const signJWT = require('../utils/sign-jwt-token')
const { messages, tokenOpTypes, statusTxt } = require('../config/parameters')

module.exports = {
    //---- signin  success
    /* 
    This function assumes that the signin was authorized by a previous middleware authorization function in the pipeline.
    Considering that, this function will simply prepare and send the JWT token to the client
    
    This function should not be run without an authorization function previously in the pipeline, as tokens could be issued
    to unauthorized users.
    */
    signinSuccess: async function (req, res, next) {
        try {
            /*
            Destructure the request object, extracting the prop resultAuth, which should have been attached 
            by the previous procedure in the pipeline
            */
            const { resultAuth } = req

            if (!resultAuth?.payload?.userInfo?._id) {
                /*resultAuth.userInfo._id was not received in the request object, since this function executes after 
                a middleware that is supposed to attach it, some internal error must have occured*/
                return res.status(500).json({ error: messages.msgInternalError })
            }

            //No internal errors occurred, proceed with JWT signing
            const JWT = signJWT({
                userId: resultAuth.payload.userInfo._id,
                opType: tokenOpTypes.signin // Encode opType Signin in the token's payload
            })

            //Send a successful response, with the resultAuth payload plus signinToken
            res.status(resultAuth.httpStatusCode).json({
                ...resultAuth.payload,
                signinJWT: JWT
            })
        }
        catch (error) {
            console.error(error)
            next({ error: error, message: messages.msgErrSendToClient })
        }
    },

    //---- signin  check auth success
    /* 
    Function that notifies the client that the check auth was successful. Check auth involves receiving and validating that
    a received JWT token for the signin operation is valid. Middleware auth functions perform that task. Afterwards, this 
    handler funtion sends a 200 response without further validations or operations necessary.
    */
    checkAuthSuccess: async function (req, res, next) {
        try {
            //Send a successful response, with the resultAuth payload plus signinToken
            res.status(200).json({
                status: statusTxt.statusCompleted,
                message: 'Token is valid and authorized for user signin protected operations'
            })
        }
        catch (error) {
            console.error(error)
            next({ error: error, message: messages.msgErrSendToClient })
        }
    }

}