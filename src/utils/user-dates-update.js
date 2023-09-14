//Import de acceso a usuario
const userDBService = require('../services/dbservices/user')

module.exports = {
    lastAccessDate: (_id) => {
        const timeStamp = new Date()
        userDBService.updateOne(
            { _id: _id },
            {
                lastAccessDate: timeStamp
            }
        )
    },
    lastSuccessfulLoginDate: (_id) => {
        const timeStamp = new Date()
        userDBService.updateOne(
            { _id: _id },
            {
                lastSuccessfulLoginDate: timeStamp,
                lastAccessDate: timeStamp
            }
        )
    } 
}