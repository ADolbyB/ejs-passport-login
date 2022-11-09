const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');     // Compare hash to stored PW hash

// Load User Schema Model
const User = require('../models/User');

// Source for passport: http://www.passportjs.org/
// Passport authentication for User Login
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            // Match user email
            User.findOne({ email: email })
                .then(user => {
                    if(!user) {     // If there is no user match
                        return done(null, false, { message: 'That Email Is Not Registered'})
                    }

                    // If user matches, check password with bcrypt hash
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        // if there is an error, throw an error
                        if(err) throw err;
                        // if Password matches, log in User.
                        if(isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Incorrect Password' });
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    // To maintain a login session, Passport serializes
    // and deserializes user information to and from the session.
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};