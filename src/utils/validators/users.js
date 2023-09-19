const Joi = require('joi')
const JoiObjectId = require('joi-objectid')(Joi) //Package for validating MongoDB Object Ids

const StrFormatValidators = require('./str-formats')

module.exports = {
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
