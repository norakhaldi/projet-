const Book = require('../models/Book');


exports.getFeaturedBooks = async (req, res) => {
  try {
    const featuredBooks = await Book.find({ featured: true }).limit(20);
    res.json(featuredBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching featured books' });
  }
};


exports.getAllBooks = async (req, res) => {
    const category = req.query.category;
    try {
        let filter = {};
        if (category) {
            filter.category = category;
        }
        const books = await Book.find(filter).populate('sellerId', 'username');
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
    try {
        const { title, author, description, price, category, isbn, publishedYear, pages, condition } = req.body;
        const coverImage = req.file ? `${req.protocol}://${req.get('host')}/Uploads/${req.file.filename}` : null;

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
            sellerId: req.user.userId,
        });
        await book.save();

        // Convert coverImage to absolute URL in response
        const bookResponse = {
            ...book._doc,
            coverImage: book.coverImage
                ? `${req.protocol}://${req.get('host')}/Uploads/${book.coverImage.split('/Uploads/')[1]}`
                : null,
        };
        res.status(201).json(bookResponse);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Erreur lors de la création du livre.', error: error.message });
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
exports.searchBooks = async (req, res) => {
    const query = req.query.q;
  
    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }
  
    try {
      const regex = new RegExp(query, "i"); // "i" = insensitive (e.g. matches "Harry" or "harry")
      const results = await Book.find({
        $or: [
          { title: { $regex: regex } },
          { author: { $regex: regex } },
          { isbn: { $regex: regex } },
        ],
      }).populate('sellerId', 'username');
  
      res.status(200).json(results);
    } catch (error) {
      console.error("Error during search:", error);
      res.status(500).json({ message: "Server error while searching books." });
    }
  };
  