const Joi = require('joi')
const JoiObjectId = require('joi-objectid')(Joi) //Package for validating MongoDB Object Ids

const StrFormatValidators = require('./str-formats')

module.exports = {
    changePasswordValidation: (data) => {
        const schema = Joi.object({
            currentPassword: Joi.string().required(),
            newPassword: Joi.string().min(6).required().pattern(StrFormatValidators.pwdRegex),
            confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required() // Validates that it must be equal to the field newPassword
        })
        return schema.validate(data)
    },
    usersParamValidation: (data) => {
        const schema = Joi.object({
            id: JoiObjectId().required(), //This functionality is coupled with a MongoDB database and must be change if the databse is changed
        })
        return schema.validate(data)
    },
    usersUpdateValidation: (data) => {
        const schema = Joi.object({
            firstName: Joi.string().min(3).required().pattern(StrFormatValidators.nameRegex),
            lastName: Joi.string().min(3).required().pattern(StrFormatValidators.nameRegex),
            receiveEmails: Joi.boolean().required()
        })
        return schema.validate(data)
    }
}
