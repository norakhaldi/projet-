const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticate, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const Book = require('../models/book'); // Verify this path

// Debug log to confirm the import
console.log('Book model in bookRoutes.js:', Book);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Uploads/'); // Capitalized to match server.js
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Veuillez uploader une image valide (JPEG, PNG, etc.).'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Routes accessibles à tout le monde
router.get('/', bookController.getAllBooks); // Voir tous les livres
router.get('/featured', bookController.getFeaturedBooks); // Livres featured
router.get('/search', bookController.searchBooks); // Search books by title, author, or ISBN
router.get('/:id', bookController.getBookById); // Voir un livre par ID

// Routes pour utilisateurs authentifiés
router.get('/user/listings', authenticate, bookController.getUserListings); // Get user's listed books
router.post('/', authenticate, upload.single('image'), (req, res, next) => {
    // Handle multer errors
    if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError.message });
    }
    bookController.createBook(req, res, next);
}); // Créer un livre

// Routes réservées aux administrateurs
router.put('/:id', authenticate, isAdmin, bookController.updateBook); // Modifier un livre
router.delete('/:id', authenticate, isAdmin, bookController.deleteBook); // Supprimer un livre

// POST /api/books/batch - Fetch multiple books by IDs
router.post('/batch', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Un tableau d\'IDs est requis.' });
        }

        const books = await Book.find({ _id: { $in: ids } });
        // Ensure absolute URLs for coverImage
        const booksWithAbsoluteUrls = books.map(book => ({
            ...book._doc,
            coverImage: book.coverImage
                ? `${req.protocol}://${req.get('host')}/Uploads/${book.coverImage.split('/Uploads/')[1]}`
                : null,
        }));
        res.json(booksWithAbsoluteUrls);
    } catch (error) {
        console.error('❌ Error fetching books by batch:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des livres.', error: error.message });
    }
});

module.exports = router;