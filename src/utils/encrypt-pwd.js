const bcrypt = require('bcrypt')
const rounds = 10

// Encrypt password with hash function
const encryptPwd = async (password) => {
    return (await bcrypt.hash(password, rounds))
}

//Default export
module.exports = encryptPwd