function preventLoggedInAccess(req, res, next) {
    if (req.session && req.session.user) {
        // User is logged in, redirect to another page (e.g., /user)
        return res.redirect("/user");
    }
    // If not logged in, continue to the requested route
    next();
}

module.exports = {preventLoggedInAccess};