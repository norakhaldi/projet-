const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth'); // ✅ Utilisation du bon fichier

// Route d'inscription (publique)
router.post('/register', authController.register);

// Route de connexion (publique)
router.post('/login', authController.login);

// Route protégée (nécessite un token valide)
router.get('/profile', auth.authenticate, (req, res) => {
    res.json({ message: 'Profil utilisateur', userId: req.userId });
});
// Route de déconnexion (optionally protected)
router.post('/logout', auth.authenticate, (req, res) => {
    // Since JWT is stateless, no server-side token invalidation is needed unless you implement a blacklist
    res.status(200).json({ message: 'Déconnexion réussie.' });
});
module.exports = router;