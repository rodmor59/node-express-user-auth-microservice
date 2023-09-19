//Import de acceso a usuario
const userDBService = require('../services/dbservices/user')
const {
    numWrongPwdAttemptsToLockUser,
    userStatus
} = require('../config/parameters')

module.exports = {
    increaseFailedLoginAttempts: (user) => {
        // Sets updated user failed login attempts
        const updatedFailedLoginAttempts = user.failedLoginAttempts + 1
        let dataToUpdate = {
            failedLoginAttempts: updatedFailedLoginAttempts
        }
        if (updatedFailedLoginAttempts === numWrongPwdAttemptsToLockUser) { // on this attempt, failed logins have reached the lock user threshold
            dataToUpdate = {
                ...dataToUpdate,
                status: userStatus.lockedFailedLogin
            }
        }
        userDBService.updateOne({ _id: user._id }, dataToUpdate)
    },
    updateLastAccessOn: (_id) => {
        const timeStamp = new Date()
        userDBService.updateOne(
            { _id: _id },
            {
                lastAccessOn: timeStamp
            }
        )
        //returns the timeStamp used to update lastAccessOn
        return timeStamp
    },
    updateSuccessfulLogin: (_id) => {
        const timeStamp = new Date()
        userDBService.updateOne(
            { _id: _id },
            {
                failedLoginAttempts: 0, //Resets failed login attempts to zero, since login was successful
                lastSuccessfulLoginOn: timeStamp,
                lastAccessOn: timeStamp
            }
        )
        //returns the timeStamp used to update lastSuccessfulLoginOn and lastAccessOn
        return timeStamp
    },
    updateUserDataUpdatedOn: (_id) => {
        const timeStamp = new Date()
        userDBService.updateOne(
            { _id: _id },
            {
                userDataUpdatedOn: timeStamp,
                lastAccessOn: timeStamp
            }
        )
        //returns the timeStamp used to update lastSuccessfulLoginOn and lastAccessOn
        return timeStamp
    } 
}