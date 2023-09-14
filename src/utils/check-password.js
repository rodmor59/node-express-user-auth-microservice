//Imports
const bcrypt = require('bcrypt')

// Encriptar password utilizando función hash
const isPasswordValid = async(passwordToCheck, encryptedPassword) => {
    return (await bcrypt.compare(passwordToCheck, encryptedPassword))
}

//Default export
module.exports = isPasswordValid
