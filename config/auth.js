// Middleware to ensure users must be logged in to view Dashboard
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'You Are Not Logged In: Please Log In');
    res.redirect('/users/login');
    next();
};

// Middleware to check if user is already logged in
// Prevents User from going back to Welcome / Login / Register pages if logged in.
function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        //req.flash('error_msg', 'You Are Already Logged In');
        return res.redirect('/dashboard');   // redirect logged in user to the dashboard
    }
    next();
};

module.exports = { ensureAuthenticated, checkNotAuthenticated };