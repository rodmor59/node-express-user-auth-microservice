const Joi = require('joi')
const JoiObjectId = require('joi-objectid')(Joi) //Package for validating MongoDB Object Ids

module.exports = {
    tokenPayloadValidation: (data) => {
        const schema = Joi.object({
            userId: JoiObjectId().required(), //This functionality is coupled with a MongoDB database and must be change if the databse is changed
            opType: Joi.string().required() // Tokens must be encoded with a opType
        }).unknown(true) // Allow unknown fields in the validated object

        return schema.validate(data)
    }
}
