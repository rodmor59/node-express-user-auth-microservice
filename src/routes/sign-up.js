const express = require('express')
const router = express.Router()
const signUpHandler = require('../handlers/sign-up')

console.log('Sign Up Handler Loaded')

//---- routing to user sign-up (Registration)
router.post('/sign-up', signUpHandler.signUp)

module.exports = router
