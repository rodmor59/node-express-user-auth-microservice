const mongoose =require('mongoose')
const UserModel = mongoose.model('User')

module.exports = {
    findByEmail: async (email) =>
        await UserModel.find({ email: email }),
    findById: async (id) =>
        await UserModel.findById(id),
    findByIdWithoutPwd: async (id) =>
        await UserModel.findById(id)
            .select('-password'),
    findOneByEmail: async (email) =>
        await UserModel.findOne({ email: email }),
    findOneByEmailWithoutPwd: async (email) =>
        await UserModel.findOne({ email: email })
            .select('-password'),
    create: async (userDataObj) =>
        await UserModel.create({ ...userDataObj }),
    updateOne: async (options = {}, updateData = {}) => 
        await UserModel.updateOne(options, updateData)
}