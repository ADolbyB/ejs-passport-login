// Middleware to ensure users must be logged in to view Dashboard

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'You Are Not Logged In: Please Log In');
        res.redirect('/users/login');
    }
}