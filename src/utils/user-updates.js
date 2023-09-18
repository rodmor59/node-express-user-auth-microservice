//Import de acceso a usuario
const userDBService = require('../services/dbservices/user')
const {
    numWrongPwdAttemptsToLockUser,
    userStatus
} = require('../config/parameters')

module.exports = {
    increaseFailedLoginAttempts: (user) => {
        let dataToUpdate = {
            failedLoginAttempts: user.failedLoginAttempts + 1
        }
        if (user.failedLoginAttempts === numWrongPwdAttemptsToLockUser) {
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
    } 
}