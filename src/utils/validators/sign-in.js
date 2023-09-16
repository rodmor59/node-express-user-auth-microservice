const Joi = require('joi')

module.exports.signinValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })

    return schema.validate(data)
}
