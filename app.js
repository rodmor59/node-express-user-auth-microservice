/*
This file containes the entry point of this Node App.
It import the app (which is in a separate file) and assign an HTTP server to it.
*/

//Load envirorment variables
require('dotenv').config()

const app = require('./src/app')
const port = process.env.APP_PORT

//Start server
app.listen(port, () => {
    console.log(`server started in ${app.get('env')} mode`)
})
