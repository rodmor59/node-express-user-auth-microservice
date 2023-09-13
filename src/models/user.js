const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        email: { //The email is the username in this model (Users don't have a separate username field)
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        receiveEmails: {
            type: Boolean,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        failedLoginAttempts: { //represents the number of failed password login attempts.
            type: Number,
            required: true
        },
        lastAccessDate: { //Sucessful login or not. A failed login will set this date.
            type: Date,
            required: true
        },
        lastSuccessfulLoginDate: {
            type: Date,
        },
    },
    { //CreatedOn and UpdatedOn fields are added and managed by moongose
        timestamps: true,
    }
)

mongoose.model('User', userSchema)