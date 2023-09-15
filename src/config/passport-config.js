const passport = require('passport')
const passportStrategies = require('./passport-strategies')


// Configure Passport.js
passport.use('local', passportStrategies.localStrategy)
//passport.use('jwt', passportStrategies.jwtStrategy)



