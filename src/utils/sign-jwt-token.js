const jwt = require('jsonwebtoken')

const { signinTokenOptions } = require('../config/parameters')

const signJWT = (payload) => {
    /*
    JWT Secret Key is specified as a .env variable. 
    TokenOptions (expiration time) are loaded from the configuration parameters.
    */
    return `Bearer ${jwt.sign(payload, process.env.JWT_SECRET, signinTokenOptions)}`
}

module.exports = signJWT