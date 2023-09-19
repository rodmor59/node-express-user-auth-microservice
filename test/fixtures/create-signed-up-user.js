const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { userStatus } = require('../setup/parameters') //The testing parameters

const UserModel = mongoose.model('User') //For preparing and deleting test data directly in the DB

//Constants
const saltRounds = 10 //Rounds for password encryption

/*
Creates a user with an encrypted password to use it in signin, user modifications and password reset tests. These
tests validates the system bahaviour of these endpoints in which the password is encrypted to compate ir to the
database (Since the system sabes encrypted passwords in the database)
*/
const createSignedUpUser = async (
    userData,
    usrStatus = userStatus.enabled, // May create a mock user with a status different than enabled (Pending, Lockeck, etc.)
    setlastSuccessfulLoginOn = false, // Has the option to set the last successful login on date, which in effect is a mock user that has logged in
    failedLoginAttempts = 0 // User may be created with a number of failed login attempts for testing purposes. Default is 0.
) => {

    const currentDate = new Date()

    let lastSuccessfulLoginOn = null
    if (setlastSuccessfulLoginOn) {
        lastSuccessfulLoginOn = currentDate
    }

    //Encrypts password
    const encryptedPwd = await bcrypt.hash(userData.password, saltRounds)

    //Data preparation steps (Insert testSignUpData directly into the db)
    const newUser = await UserModel.create({
        ...userData,
        password: encryptedPwd, //Password is saved to the database encrypted
        status: usrStatus,
        failedLoginAttempts: failedLoginAttempts,
        createdOn: currentDate,
        userDataUpdatedOn: currentDate,
        lastAccessOn: currentDate,
        lastSuccessfulLoginOn: lastSuccessfulLoginOn
    })
    return newUser.toObject() // Return the complete user data
}

//Default export
module.exports = createSignedUpUser