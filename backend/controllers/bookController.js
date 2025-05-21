const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('sellerId', 'username');
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des livres.', error });
    }
};

exports.getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id).populate('sellerId', 'username');
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé.' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du livre.', error });
    }
};

exports.createBook = async (req, res) => {
    const { title, author, description, price, category, isbn, publishedYear, pages, condition } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const book = new Book({
            title,
            author,
            description,
            price,
            coverImage,
            category,
            isbn,
            publishedYear,
            pages,
            condition,
            sellerId: req.user.userId, // From JWT
        });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du livre.', error });
    }
};

exports.getUserListings = async (req, res) => {
    try {
        const books = await Book.find({ sellerId: req.user.userId });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des livres de l\'utilisateur.', error });
    }
};

exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, description, price, coverImage, filePath, category, isbn, publishedYear, pages, condition } = req.body;

    try {
        const book = await Book.findByIdAndUpdate(
            id,
            { title, author, description, price, coverImage, filePath, category, isbn, publishedYear, pages, condition },
            { new: true }
        );
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé.' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du livre.', error });
    }
};

exports.deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé.' });
        }
        res.status(200).json({ message: 'Livre supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du livre.', error });
    }
};