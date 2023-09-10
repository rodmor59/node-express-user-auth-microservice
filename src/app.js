const express = require('express')
const app = express()
const { registerDbModels } = require('./config/database')
//App configuration
const {customCors, customErrorHandler} = require('./config/app')

// Setup custom CORS from the app configuration
app.use(customCors)

app.use(express.json())

//App requires for the DB Models to be registered
registerDbModels()

//Routes
app.use(require('./routes/sign-up'))

//Setup custom error handler from the app configuration
app.use(customErrorHandler)

//Export the app as default
module.exports = app