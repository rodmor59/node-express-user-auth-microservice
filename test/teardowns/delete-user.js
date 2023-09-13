const mongoose = require('mongoose')
const UserModel = mongoose.model('User') //For preparing and deleting test data directly in the DB

const deleteUser = async (testEmail) => {
    await UserModel.deleteOne({ email: testEmail })
}

//Default export
module.exports = deleteUser