const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { name, email, password } = req.body; // Changed username to name to match frontend

    try {
        console.log("🟢 Données reçues :", req.body);

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà." });
        }

        // Créer un nouvel utilisateur
        const user = new User({
            username: name, // Map name to username
            email,
            password,
            role: "user"
        });

        await user.save();

        // Générer un token
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
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Identifiants invalides." });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Identifiants invalides." });
        }

        // Générer un token
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
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};