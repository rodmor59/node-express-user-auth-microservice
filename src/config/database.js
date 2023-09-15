const mongoose = require('mongoose')

//Console log messages
const msgScsDBConnect = 'connected to DB'
const msgErrDBConnect = 'Database connection error'

module.exports = {
    // Register DB Models (MongoDB)
    registerDbModels: async () => {
        require('../models/user')
    },
    connectDB: async (uri) => {
        //Connect to the database. URI is configured in the .env file
        mongoose.connect(uri)

        mongoose.connection.on('connected', () => {
            console.log(msgScsDBConnect)
        })

        mongoose.connection.on('error', (error) => {
            console.log(msgErrDBConnect)
            console.log('')
            console.log(error)
        })
    }
}
