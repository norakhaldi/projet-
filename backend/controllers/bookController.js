const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: './Uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Middleware for file upload
exports.upload = upload.single('image');

exports.getFeaturedBooks = async (req, res) => {
  try {
    const featuredBooks = await Book.find({ featured: true }).limit(20);
    res.json(featuredBooks);
  } catch (error) {
    console.error('getFeaturedBooks error:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des livres en vedette.' });
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
    console.log('getAllBooks: Found books:', books.length);
    res.status(200).json(books);
  } catch (error) {
    console.error('getAllBooks error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des livres.', error: error.message });
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
    console.error('getBookById error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du livre.', error: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { title, author, description, price, category, isbn, publishedYear, pages, condition } = req.body;
    const coverImage = req.file ? `${req.protocol}://${req.get('host')}/Uploads/${req.file.filename}` : req.body.coverImage;

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
    console.log('createBook: Book saved:', book._id);

    res.status(201).json(book);
  } catch (error) {
    console.error('createBook error:', error);
    res.status(500).json({ message: 'Erreur lors de la création du livre.', error: error.message });
  }
};

exports.getUserListings = async (req, res) => {
  try {
    const books = await Book.find({ sellerId: req.user.userId });
    res.status(200).json(books);
  } catch (error) {
    console.error('getUserListings error:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des livres de l'utilisateur.", error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  console.log('updateBook: Request body:', req.body);
  console.log('updateBook: Request file:', req.file);
  console.log('updateBook: User:', req.user);

  try {
    // Check if the user is an admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé : Seuls les administrateurs peuvent modifier les livres.' });
    }

    // Prepare update fields
    const updateFields = {};
    if (req.body.title) updateFields.title = req.body.title;
    if (req.body.author) updateFields.author = req.body.author;
    if (req.body.description) updateFields.description = req.body.description;
    if (req.body.price) updateFields.price = parseFloat(req.body.price);
    if (req.body.category) updateFields.category = req.body.category;
    if (req.body.isbn) updateFields.isbn = req.body.isbn;
    if (req.body.publishedYear) updateFields.publishedYear = parseInt(req.body.publishedYear);
    if (req.body.pages) updateFields.pages = parseInt(req.body.pages);
    if (req.body.condition) updateFields.condition = req.body.condition;
    if (req.file) {
      updateFields.coverImage = `${req.protocol}://${req.get('host')}/Uploads/${req.file.filename}`;
    } else if (req.body.coverImage) {
      updateFields.coverImage = req.body.coverImage;
    }

    console.log('updateBook: Update fields:', updateFields);

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'Aucun champ à mettre à jour.' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    console.log('updateBook: Updated book:', updatedBook);

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error('updateBook error:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du livre.', error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }
    console.log('deleteBook: Book deleted:', id);
    res.status(200).json({ message: 'Livre supprimé avec succès.' });
  } catch (error) {
    console.error('deleteBook error:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du livre.', error: error.message });
  }
};

exports.searchBooks = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: 'La requête de recherche est requise.' });
  }

  try {
    const regex = new RegExp(query, 'i');
    const results = await Book.find({
      $or: [{ title: { $regex: regex } }, { author: { $regex: regex } }, { isbn: { $regex: regex } }],
    }).populate('sellerId', 'username');
    res.status(200).json(results);
  } catch (error) {
    console.error('searchBooks error:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la recherche de livres.' });
  }
};