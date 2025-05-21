function authMiddleware(req, res, next) {
    const userCookie = req.cookies.user;

    if (userCookie) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

module.exports = authMiddleware
