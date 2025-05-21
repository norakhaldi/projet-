const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret from .env
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.', error });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Admin access required.' });
    }
};

module.exports = { authenticate, isAdmin };