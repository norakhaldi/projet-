const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticate, isAdmin } = require('../middleware/auth'); // 🔥 Import des middlewares

// Routes accessibles à tout le monde (y compris les utilisateurs)
router.get('/', bookController.getAllBooks);  // Voir tous les livres
router.get('/:id', bookController.getBookById); // Voir un livre par ID

// Routes réservées aux administrateurs
router.post('/', authenticate, isAdmin, bookController.createBook);  // Créer un livre
router.put('/:id', authenticate, isAdmin, bookController.updateBook); // Modifier un livre
router.delete('/:id', authenticate, isAdmin, bookController.deleteBook); // Supprimer un livre

module.exports = router;
