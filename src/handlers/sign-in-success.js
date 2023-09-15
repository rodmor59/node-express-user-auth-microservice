const signJWT = require('../utils/sign-jwt-token')
const appParameters = require('../config/parameters')

//---- signin  success
/* 
This function assumes that the signin was authorized by a previous middleware authorization function in the pipeline.
Considering that, this function will simply prepare and send the JWT token to the client

This function should not be run without an authorization function previously in the pipeline, as tokens could be issued
to unauthorized users.
*/
module.exports.signinSuccess = async function (req, res, next) {
    try {
        /*
        Destructure the request object, extracting the prop resultAuth, which should have been attached 
        by the previous procedure in the pipeline
        */
        const { resultAuth } = req

        if (!resultAuth?.payload?.userInfo?._id) {
            /*resultAuth.userInfo._id was not received in the request object, since this function executes after 
            a middleware that is supposed to attach it, some internal error must have occured*/
            return res.status(500).json({error: appParameters.messages.msgInternalError})
        }

        //No internal errors occurred, proceed with JWT signing
        const JWT = signJWT({ userId: resultAuth?.userInfo?._id })
        
        //Send a successful response, with the resultAuth payload plus signinToken
        res.status(resultAuth.httpStatusCode).json({
            ...resultAuth.payload,
            signinJWT: JWT
        })
    }
    catch (error) {
        console.error(error)
        next({ error: error, message: appParameters.messages.msgErrSendToClient })
    }
}