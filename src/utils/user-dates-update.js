//Import de acceso a usuario
const userDBService = require('../services/dbservices/user')

module.exports = {
    lastAccessOn: (_id) => {
        const timeStamp = new Date()
        userDBService.updateOne(
            { _id: _id },
            {
                lastAccessOn: timeStamp
            }
        )
    },
    lastSuccessfulLoginOn: (_id) => {
        const timeStamp = new Date()
        userDBService.updateOne(
            { _id: _id },
            {
                lastSuccessfulLoginOn: timeStamp,
                lastAccessOn: timeStamp
            }
        )
    } 
}