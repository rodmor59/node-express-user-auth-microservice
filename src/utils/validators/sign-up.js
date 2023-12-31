const Joi = require('joi')
const StrFormatValidators = require('./str-formats')

module.exports.signupValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(3).max(256).required().email(),
        password: Joi.string().min(6).required().pattern(StrFormatValidators.pwdRegex),
        firstName: Joi.string().min(3).required().pattern(StrFormatValidators.nameRegex),
        lastName: Joi.string().min(3).required().pattern(StrFormatValidators.nameRegex),
        receiveEmails: Joi.boolean().required()
    })

    return schema.validate(data)
}
