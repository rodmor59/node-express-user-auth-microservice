const Joi = require('joi')
const JoiObjectId = require('joi-objectid')(Joi) //Package for validating MongoDB Object Ids

module.exports = {
    usersParamValidation: (data) => {
        const schema = Joi.object({
            id: JoiObjectId().required(), //This functionality is coupled with a MongoDB database and must be change if the databse is changed
        })

        return schema.validate(data)
    }
}
