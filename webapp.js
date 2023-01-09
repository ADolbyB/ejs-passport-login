const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const webapp = express();
mongoose.set('strictQuery', false);

// Display Custom Favicon
webapp.use(require('serve-favicon')(__dirname + '/img/favicon.ico'));

// Passport Config
require('./config/passport')(passport);

// Create DB Config
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// EJS middleware:
webapp.use(expressLayouts);
webapp.set('view engine', 'ejs');

// Bodyparser middleware:
webapp.use(express.urlencoded({ extended: false }));

// Express Session Middleware: https://github.com/expressjs/session
webapp.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

// PassportJS middleware: http://www.passportjs.org/concepts/authentication/sessions/
webapp.use(passport.initialize());
webapp.use(passport.session());

// Connect Flash Middleware: for flash messages
webapp.use(flash())

// Global Variables for Flash messages
webapp.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Define routes:
webapp.use('/', require('./routes/index'));
webapp.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;      // Deployed or local port

webapp.listen(PORT, console.log(`Server Started on Port: ${PORT}`));