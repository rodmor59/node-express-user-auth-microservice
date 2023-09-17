const mongoose = require('mongoose')
const UserModel = mongoose.model('User') //For getting information directly from the database

// Data access functions used when needing to assert that the addequate data was created or updated correctly
module.exports = {
    userFindById : async (id) => await UserModel.findById(id)
}