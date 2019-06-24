module.exports = {
    /**
     * Express middleware, checks if req.user.admin is true
     * res.status(401).send("Admin required") if not admin.
     */
    isAdmin: function (req, res, next) {
        if (req.user) {
            if (req.user.admin) {
                next();
            } else {
                res.status(401).send("Admin required.");
            }
        } else {
            res.status(401).send("Admin required.");
        }
    },
    
    /**
     * Express middleware, checks if req.user is defined
     * res.status(401).send("Logn required") if not logged in.
     */
    isLoggedIn: function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.status(401).send("Login required.");
        }
    },
};