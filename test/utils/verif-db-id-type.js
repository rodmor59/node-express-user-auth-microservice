const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

/*This functions encapsulates the verfication of ids to determine if they are a valid
Database id.

In case you change databases, this function must be updated, just like the modes and db access functions in the a
application
*/
const verifDbIdType = (id) => {
    return ObjectId.isValid(id)
}

//Default export
module.exports = verifDbIdType

