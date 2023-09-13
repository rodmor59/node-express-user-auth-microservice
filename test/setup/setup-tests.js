const mongoose = require('mongoose')
// Load environment variables
require('dotenv').config()

beforeAll(async () => {
    //await connectDB()
    await mongoose.connect(process.env.DB_URI)
})

afterAll(async () => {
    //Close DB Connection
    await mongoose.connection.close()
})