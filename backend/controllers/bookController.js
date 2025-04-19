const Book = require('../models/Book');

exports.createBook = async (req, res) => {
    const { title, author, description, price, coverImage, filePath } = req.body;

    try {
        const book = new Book({ title, author, description, price, coverImage, filePath });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du livre.', error });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des livres.', error });
    }
};

exports.getBookById = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé.' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du livre.', error });
    }
};

exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, description, price, coverImage, filePath } = req.body;

    try {
        const book = await Book.findByIdAndUpdate(
            id,
            { title, author, description, price, coverImage, filePath },
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
