const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; // checking the token

function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        console.log('[AUT] ' + req.ip + '  :  (+) not logged in, redirecting')
        return res.redirect('/login.html');
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.payload = payload;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.log('[AUT] ' + req.ip + '  :  (!) token expired')
        } else if (error instanceof jwt.JsonWebTokenError) {
            console.log('[AUT] ' + req.ip + '  :  (!) invalid token')
        } else {
            console.log('[AUT] ' + req.ip + '  :  (!) unexpected error')
        }

        return res.redirect('/login.html');
    }
}

module.exports = authMiddleware
