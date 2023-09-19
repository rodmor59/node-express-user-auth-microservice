const userDBService = require('../services/dbservices/user')
const appParameters = require('../config/parameters')
const { statusTxt } = require('../config/parameters')

// Const messages
const successMessageUserGet = 'User access successfully, attached is the requested user data'
const successMessageUserUpdate = 'User updated successfully'

// This function assumes that al authorization checks has been performed by previous functions in the pipeline
const usersGet = (req, res, next) => {
    try {
        /*
        Destructure the request object, extracting the prop user, which should have been attached 
        by the previous procedure in the pipeline.
        */
        const { user } = req

        if (!user) {
            /*
            user was not received in the request object, since this function executes after 
            a middleware that is supposed to attach it, an internal error must have occured
            */
            return res.status(500).json({error: appParameters.messages.msgInternalError})
        }

        /* Prepare the response user object to send. This user object must not contain the encrypted password, which should never be
        sent in a response to the client
        */
        const userResponse = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            receiveEmails: user.receiveEmails,
            status: user.status,
            createdOn: user.createdOn,
            userDataUpdatedOn: user.userDataUpdatedOn,
            failedLoginAttempts: user.failedLoginAttempts,
            lastAccessOn: user.lastAccessOn,
            lastSuccessfulLoginOn: user.lastSuccessfulLoginOn
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

// This function assumes that al authorization checks has been performed by previous functions in the pipeline
const usersUpdate = async (req, res, next) => {
    try {
        /*
        Destructure the request object, extracting the prop user, which should have been attached 
        by the previous procedure in the pipeline.
        */
        const { user } = req

        if (!user) {
            /*
            user was not received in the request object, since this function executes after 
            a middleware that is supposed to attach it, an internal error must have occured
            */
            return res.status(500).json({error: appParameters.messages.msgInternalError})
        }

        // Set the data to update in a const
        const dataToUpdate = req.body // Body has already been validated by a Joi schema that ensure it contains the appropiate fields allowed for update

        /* Update the user in the database. 
        This update must include the lastAccessOn and userDataUpdatedOn dates.
        */
        const timeStamp = new Date()
        await userDBService.updateOne({ _id: user._id }, {
            ...dataToUpdate,
            userDataUpdatedOn: timeStamp,
            lastAccessOn: timeStamp
        })
        
        //Send user to the client
        res.status(200).json({
            status: statusTxt.statusCompleted,
            message: successMessageUserUpdate,
        })

    }
    catch (error) {
        console.error(error)
        next({ error: error, message: appParameters.messages.msgErrSendToClient })
    }
}

module.exports = {
    usersGet,
    usersUpdate
}