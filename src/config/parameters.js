
module.exports = {
    /*
    Custom http response codes for notifying the client of specific condiciones, for example when an access
    was denied for conditions not covered in standar http response codes
    */
    customHttpResponseCodes: {
        userPendingStatus: 490,
        userLockedFailedLogin: 491,
    },
    /*
    General messages
    */
    messages: {
        msgErrSendToClient: 'An unexpected error occurred',
        msgInternalError: 'Internal server error'
    },

    //Number of failed attmepts with the wrong password to lock user (change user status to locked)
    numWrongPwdAttemptsToLockUser: 3,

    //Options for signin JSON web token
    signinTokenOptions: {
        expiresIn: '8h' //Set token to expire in 8 hours
    },
    /*
    Response status text.
    Text to use when notifying the client about the estatus of their operation in text.
    */
    statusTxt: {
        statusFailed: 'Failed',
        statusCompleted: 'Success'
    },

    /*
    Token types to be encoded in the tokens' payload to differentiate for different opearions
    */
    tokenOpTypes: {
        signin: 'signin',
        signupVerification: 'signup-verification',
        passwordReset: 'password-reset'
    },

    /*
    Values for the user status.
    Changes to these values after there are users registered in the database will require admin to update the old 
    values with the new in the DB.
    */
    userStatus: {
        enabled: 'Enabled',
        pending: 'Pending',
        lockedFailedLogin: 'Locked Failed Login',
        lockedAdmin: 'Locked Admin'
    }
}
