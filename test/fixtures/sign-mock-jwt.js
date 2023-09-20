const jwt = require('jsonwebtoken')

const { tokenOpType } = require('../setup/parameters') //The testing parameters

const signMockJWT = (payload, expirationTime) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: expirationTime
        })
}

const signMockJWTUserSignin = (payload, expirationTime) => {
    return jwt.sign(
        {
            ...payload,
            opType: tokenOpType.signin
        },
        process.env.JWT_SECRET,
        {
            expiresIn: expirationTime
        })
}

module.exports = {
    signMockJWT,
    signMockJWTUserSignin
}