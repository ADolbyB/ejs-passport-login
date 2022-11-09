// Middleware to check if user is already logged in
// Prevents User from going back to Welcome / Login / Register pages if logged in.

module.exports = {
    checkNotAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            //req.flash('error_msg', 'You Are Already Logged In');
            return res.redirect('/dashboard');   // redirect logged in user to the dashboard
        }
        next();
    }
}