
module.exports = {

    /*
    Testing values for the user status.
    Must correspond to the values used by the application, otherwise tests that uses them will fail
    */
    userStatus: {
        enabled: 'Enabled',
        pending: 'Pending',
        lockedFailedLogin: 'Locked Failed Login',
        lockedAdmin: 'Locked Admin'
    },

    // Delay time
    delayTime: 0.5, // seconds

    //Number of failed attmepts with the wrong password to lock user (change user status to locked)
    numWrongPwdAttemptsToLockUser: 3,

}
