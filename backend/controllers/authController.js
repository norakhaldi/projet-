const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// 🛠 Middleware pour s'assurer que `express.json()` est bien activé (à mettre dans `server.js` aussi)
const express = require('express');
const app = express();
app.use(express.json());

// 📌 **Enregistrement (Register)**
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        console.log("🟢 Données reçues :", req.body); // 🔥 Vérifier ce qui est reçu

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "L'utilisateur existe déjà." });
        }

        // Créer un nouvel utilisateur avec un rôle par défaut "user"
        const user = new User({
            username,
            email,
            password,
            role: role || "user"  // 🔥 Si aucun rôle n'est précisé, c'est un "user"
        });

        console.log("🟡 Avant sauvegarde :", user); // 🔥 Vérifie si le `role` est bien défini

        await user.save();

        console.log("🟢 Après sauvegarde :", user); // 🔥 Vérifie si le `role` est bien enregistré

        res.status(201).json({ message: "Utilisateur créé avec succès.", user });
    } catch (error) {
        console.error("❌ Erreur :", error);
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};

// 📌 **Connexion (Login)**
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

        // Générer un token avec le rôle
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // 🔥 Ajouter le rôle au token
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Retourner le token + rôle + nom d'utilisateur
        res.status(200).json({
            token,
            role: user.role,  // 🔥 Maintenant le rôle est retourné
            username: user.username
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur.", error });
    }
};
