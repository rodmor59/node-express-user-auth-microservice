const mongoose = require('mongoose')
const UserModel = mongoose.model('User') //For preparing and deleting test data directly in the DB

const tstSignUpUsrStatus = 'test'

module.exports.createTestUser = async (signUpdata) => {
    //Data preparation steps (Insert testSignUpData directly into the db)
    await UserModel.create({
        ...signUpdata,
        status: tstSignUpUsrStatus, //Not relevant for test but must pass it as the Schema requires it. Any string value will suffice.
        failedLoginAttempts: 0, //Not relevant for test but must pass it as the Schema requires it
        lastAccessDate: new Date(), //Not relevant for test but must pass it as the Schema requires it
        lastSuccessfulLoginDate: null //Not relevant for test but must pass it as the Schema requires it
    })
}

module.exports.deleteTestUser = async (testEmail) => {
    await UserModel.deleteOne({ email: testEmail })
}
