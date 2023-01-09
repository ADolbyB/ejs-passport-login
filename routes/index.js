const express = require('express');
const router = express.Router();
const { ensureAuthenticated, checkNotAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', checkNotAuthenticated, (req, res) => res.render('welcome'));

// Dashboard Page
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        firstName: req.user.firstName,  // Display User's Name on Dashboard
        lastName: req.user.lastName,
        address: req.user.address
    }));

//router.get('/about', (req, res) => res.send('ABOUT US')); // debug
router.get('/about', ensureAuthenticated, (req, res) => res.render('about'));

//router.get('/userman', (req, res) => res.send('USER MANUAL')); // debug
router.get('/userman', ensureAuthenticated, (req, res) => res.render('userman'));

module.exports = router;