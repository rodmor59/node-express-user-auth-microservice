const mongoose = require('mongoose')
const UserModel = mongoose.model('User') //For preparing and deleting test data directly in the DB

const tstSignUpUsrStatus = 'test'

/*
Creates a user in the database to test signup functionality, such as rejection of duplicate passwords. Therefore, it
doesn't need to encrypt password for these tests.
*/
const createUser = async (signUpdata) => {
    //Data preparation steps (Insert testSignUpData directly into the db)
    await UserModel.create({
        ...signUpdata,
        status: tstSignUpUsrStatus, //Not relevant for test but must pass it as the Schema requires it. Any string value will suffice.
        failedLoginAttempts: 0, //Not relevant for test but must pass it as the Schema requires it
    })
}

//Default export
module.exports = createUser