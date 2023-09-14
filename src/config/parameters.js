

/*
Custom http response codes for notifying the client of specific condiciones, for example when an access
was denied for conditions not covered in standar http response codes
*/
module.exports.customHttpResponseCodes = {
    userPendingStatus: 490,
    userLockedFailedLogin: 491,
}

/*
General messages
*/
module.exports.messages = {
    msgErrSendToClient: 'An unexpected error occurred'
}

//Number of failed attmepts with the wrong password to lock user (change user status to locked)
module.exports.numWrongPwdAttemptsToLockUser = 3

//Options for signin JSON web token
module.exports.signinTokenOptions = {
    expiresIn: '8h' //Set token to expire in 8 hours
}

/*
Response status text.
Text to use when notifying the client about the estatus of their operation in text.
*/
module.exports.statusTxt = {
    statusFailed: 'Failed',
    statusCompleted: 'Success'
}

/*
Values for the user status.
Changes to these values after there are users registered in the database will require admin to update the old 
values with the new in the DB.
*/
module.exports.userStatus = {
    enabled: 'Enabled',
    pending: 'Pending',
    lockedFailedLogin: 'Locked Failed Login',
    lockedAdmin: 'Locked Admin'
}
