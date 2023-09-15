const passportLocal = require('passport-local')
//const passportJWT = require('passport-jwt')

const signinService = require('../services/sign-in-auth')

// Define the local strategy for username/password authentication
module.exports = {
    localStrategy: new passportLocal.Strategy(
        {
            usernameField: 'email', // Assuming the email is used as the username
            usernamePassword: 'password'
        },
        async (email, password, done) => {

            //Call the signin Service
            const usrAuthResult = await signinService.authentication(email, password)

            /*
            The signin authentication service will return an object with all the information that needs to be 
            sent to the client in case authorization fails.

            it returns different http status codes, depending on the reason (incorrect email, wrong password, 
            user locked, among others).

            This information needs to be send as is to the caller function, so it can then be sent to the client
            
            */
            return done(null, usrAuthResult)
        }
    ),

    // Define the JWT strategy for token-based authentication
    /*jwtStrategy: new passportJWT.Strategy(
        {
            jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_SIGNIN,
        },
        (jwtPayload, done) => {
            // Logic to authenticate the user based on JWT payload
            // ...

            if (authenticated) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        }
    )*/
}
