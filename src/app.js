const express = require('express')
const app = express()
//App configuration
const {customCors, customErrorHandler} = require('./config/app')

// Setup custom CORS from the app configuration
app.use(customCors)

//Connect database
require('./config/database')

app.use(express.json())

//Routes
app.use(require('./routes/sign-up'))

//Setup custom error handler from the app configuration
app.use(customErrorHandler)

//Export the app as default
module.exports = app