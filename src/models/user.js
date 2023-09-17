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
        createdOn: { //Any user data access. A failed login will set this date.
            type: Date,
            required: true,
            default: Date.now()
        },
        userDataUpdatedOn: { //Any user data access. A failed login will set this date.
            type: Date,
            required: true,
            default: Date.now()
        },
        lastAccessOn: { //Any user data access. A failed login will set this date.
            type: Date,
            required: true,
            default: Date.now()
        },
        lastSuccessfulLoginOn: {
            type: Date,
            default: null
        },
    },
)

mongoose.model('User', userSchema)