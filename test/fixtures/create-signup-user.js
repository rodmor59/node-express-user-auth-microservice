const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UserModel = mongoose.model('User') //For preparing and deleting test data directly in the DB

//Constants
const saltRounds = 10
const tstSignUpUsrStatus = 'test'

/*
Creates a user with an encrypted password to use it in signin, user modifications and password reset tests. These
tests validates the system bahaviour of these endpoints in which the password is encrypted to compate ir to the
database (Since the system sabes encrypted passwords in the database)
*/
const createSignUpUser = async (signUpdata) => {
    //Encrypts password
    const encryptedPwd = await bcrypt.hash(signUpdata.password, saltRounds)

    //Data preparation steps (Insert testSignUpData directly into the db)
    await UserModel.create({
        ...signUpdata,
        password: encryptedPwd, //Password is saved to the database encrypted
        status: tstSignUpUsrStatus, //Not relevant for test but must pass it as the Schema requires it. Any string value will suffice.
        failedLoginAttempts: 0, //Not relevant for test but must pass it as the Schema requires it
        lastAccessDate: new Date(), //Not relevant for test but must pass it as the Schema requires it
        lastSuccessfulLoginDate: null //Not relevant for test but must pass it as the Schema requires it
    })
}

//Default export
module.exports = createSignUpUser