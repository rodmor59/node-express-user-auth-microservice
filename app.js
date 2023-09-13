/*
This file containes the entry point of this Node App.
It import the app (which is in a separate file) and assign an HTTP server to it.
*/

//Load envirorment variables
require('dotenv').config()
const port = process.env.APP_PORT
const { connectDB } = require('./src/config/database')
const app = require('./src/app')

//Connect to database
connectDB(process.env.DB_URI)

//Start server
app.listen(port, () => {
    console.log(`server started in ${app.get('env')} mode`)
})
