const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticate, isAdmin } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Routes accessibles à tout le monde
router.get('/', bookController.getAllBooks);  // Voir tous les livres

// NOUVELLE ROUTE pour les livres featured
router.get('/featured', bookController.getFeaturedBooks);

// Routes pour utilisateurs authentifiés
router.get('/user/listings', authenticate, bookController.getUserListings); // Get user's listed books

// Search books by title, author, or ISBN
router.get('/search', bookController.searchBooks);


// Attention : cette route doit venir après toutes les routes spécifiques
router.get('/:id', bookController.getBookById); // Voir un livre par ID

// Routes pour utilisateurs authentifiés (création)
router.post('/', authenticate, upload.single('image'), bookController.createBook);  // Créer un livre (any user)

// Routes réservées aux administrateurs
router.put('/:id', authenticate, isAdmin, bookController.updateBook); // Modifier un livre
router.delete('/:id', authenticate, isAdmin, bookController.deleteBook); // Supprimer un livre

module.exports = router;
