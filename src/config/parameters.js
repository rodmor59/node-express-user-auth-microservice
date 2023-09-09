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
General messages
*/
module.exports.messages = {
    msgErrSendToClient: 'An unexpected error occurred'
}