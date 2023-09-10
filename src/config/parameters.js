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

/*
Response status text.
Text to use when notifying the client about the estatus of their operation in text.
*/
module.exports.statusTxt = {
    statusFailed: 'Failed',
    statusCompleted: 'Success'
}

/*
General messages
*/
module.exports.messages = {
    msgErrSendToClient: 'An unexpected error occurred'
}