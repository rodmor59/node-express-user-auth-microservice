const appParameters = require('../config/parameters')
const { statusTxt } = require('../config/parameters')

// Const messages
const successMessageUserGet = 'User access successfully, attached is the requested user data'

// This function assumes that al authorization checks has been performed by previous functions in the pipeline
const usersGet = (req, res, next) => {
    try {
        /*
        Destructure the request object, extracting the prop user, which should have been attached 
        by the previous procedure in the pipeline.

        Also, destructre an object that does not contain the encrypted password, to avoid sending it back to the
        client in the request. 

        Furthermore, disable esLint for the next line to suprress the warning that password is not used.

        */
        /* eslint-disable-next-line */
        const { user } = req

        if (!user) {
            /*user was not received in the request object, since this function executes after 
            a middleware that is supposed to attach it, some internal error must have occured*/
            return res.status(500).json({error: appParameters.messages.msgInternalError})
        }

        // Prepare the response user object to send, since it must not contain the password
        const userResponse = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            receiveEmails: user.receiveEmails,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            failedLoginAttempts: user.failedLoginAttempts,
            lastAccessDate: user.lastAccessDate,
            lastSuccessfulLoginDate: user.lastSuccessfulLoginDate
        }

        //Send user to the client
        res.status(200).json({
            status: statusTxt.statusCompleted,
            message: successMessageUserGet,
            user: userResponse
        })

    }
    catch (error) {
        console.error(error)
        next({ error: error, message: appParameters.messages.msgErrSendToClient })
    }
}

module.exports = {
    usersGet
}