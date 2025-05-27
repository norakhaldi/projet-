const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Aucun token fourni.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contient userId et role
        next();
    } catch (error) {
        console.error("❌ Token invalide :", error);
        return res.status(401).json({ message: 'Token invalide.', error });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Accès administrateur requis.' });
    }
};

module.exports = { authenticate, isAdmin };
