const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Middleware d'authentification
exports.authenticate = (req, res, next) => {
    // On cherche d'abord dans le header, sinon dans le body
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.body.token;

    if (!token) {
        return res.status(401).json({ message: '⛔ Accès refusé. Token manquant.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: '⛔ Token invalide.' });
    }
};


// ✅ Middleware pour vérifier si l'utilisateur est admin
exports.isAdmin = (req, res, next) => {
    console.log("🔎 Vérification rôle :", req.user?.role); // 🔥 Debugging

    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "⛔ Accès refusé. Admin requis." });
    }
    next();
};
