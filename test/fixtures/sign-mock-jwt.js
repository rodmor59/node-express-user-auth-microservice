const jwt = require('jsonwebtoken')

//This function allows to create JWT tokens with any key and expiration time for testing purposes
const signMockJWT = (payload, secretKey, expirationTime) => {
    return jwt.sign(
        payload,
        secretKey,
        {
            expiresIn: expirationTime
        })
}

module.exports = signMockJWT