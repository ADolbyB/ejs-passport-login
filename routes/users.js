const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { checkNotAuthenticated } = require('../config/auth');

// User Model
const User = require('../models/User');
const { session } = require('passport');

// Login Page:
// router.get('/login', (req, res) => res.send('Login'));   // Debug
router.get('/login', checkNotAuthenticated, (req, res) => res.render('login'));

// Register Page:
// router.get('/register', (req, res) => res.send('Register'));
router.get('/register', checkNotAuthenticated, (req, res) => res.render('register'));

// Register Handle Post Request
router.post('/register', (req, res) => {
    //console.log(req.body)     // Debug
    //res.send('SAY HELLO!')    // Debug
    const { firstName, lastName, address, email, password, password2 } = req.body;
    let errors = [];

    // Check all required fields
    if (!firstName || !lastName || !address || !email || !password || !password2) {
        errors.push({ msg: 'Please Fill In All Fields'});
    }

    // Check that passwords match:
    if (password !== password2) {
        errors.push({ msg: 'Passwords Do Not Match. Try Again.'})
    }

    // Check Password length: min 6 characters
    if (password.length < 6) {
        errors.push({ msg: 'Password Must Be Minimum 6 Characters'})
    }

    // in case of registration errors: re-render the registration form
    // Save user entered data
    if (errors.length > 0) {
        res.render('register', {
            errors, firstName, lastName, address, email, password, password2
        });
    } else {    // validation passed
        // res.send('VALIDATION PASSED');    // Debug
        User.findOne({ email: email })  // mongoose method to find record
            .then(user => {
                if(user) {  // User Already Exists
                    errors.push({ msg: 'This Email Is Already Registered: Please Log In'});
                    res.render('register', {
                        errors, firstName, lastName, address, email, password, password2
                    });
                } else {    // Create a New Account
                    const newUser = new User({
                        firstName, lastName, address, email, password
                    });
                    // console.log(newUser)          // debug
                    // res.send('HELLO NEW USER');   // debug
                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            // Set new password to hashed value
                            newUser.password = hash;
                            // Save New User:
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Thank You For Registering, You May Now Log In.');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }));
                }   
            });
    }

});

// Login Handle: Implement Local Strategy with Passport
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Attempt to fix basic logout auth problem:
// https://stackoverflow.com/questions/233507/how-to-log-out-user-from-web-site-using-basic-authentication
// https://stackoverflow.com/questions/29158357/log-out-clear-session-in-node-js

// Logout Handle
// Fix "Error: req#logout requires a callback function" 
// https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
router.get('/logout', (req, res) => {
    // Use middleware logout
    req.logout(function(err) {  
        if (err) { return next(err); }
    req.flash('success_msg', 'You Have Successfully Logged Out');
    res.redirect('/');
    });
});

module.exports = router;