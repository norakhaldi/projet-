const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book'); // déplacé ici pour éviter l'import dans la fonction

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ message: "Utilisateur créé avec succès.", token, username: user.username });
    } catch (error) {
        console.error("❌ Erreur :", error);
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Identifiants invalides." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Identifiants invalides." });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            token,
            role: user.role,
            username: user.username
        });

    } catch (error) {
        console.error("❌ Erreur :", error);
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).lean();

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const booksListed = await Book.countDocuments({ sellerId: user._id });
        const booksSold = await Book.countDocuments({ sellerId: user._id, sold: true });

        res.json({
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            booksListed,
            booksSold,
        });
    } catch (error) {
        console.error("❌ Erreur dans getProfile :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.logout = async (req, res) => {
    // Pas de logique côté serveur pour JWT stateless, simple retour
    res.status(200).json({ message: "Déconnexion réussie." });
};
exports.updateProfile = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const updates = {};

        if (username) updates.username = username;
        if (email) updates.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.userId, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        res.json({ message: 'Profil mis à jour.', user: {
            username: updatedUser.username,
            email: updatedUser.email,
        } });
    } catch (error) {
        console.error("❌ Erreur updateProfile :", error);
        res.status(500).json({ message: 'Erreur serveur.', error });
    }
};
