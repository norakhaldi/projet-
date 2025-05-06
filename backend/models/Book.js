const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    coverImage: { type: String }, // URL de l'image de couverture
    filePath: { type: String },   // Chemin du fichier (PDF ou EPUB)
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Associate book with seller
    featured: { type: Boolean, default: false }, // For featured books
    category: { type: String }, // Added for frontend compatibility
    isbn: { type: String }, // Added for frontend compatibility
    publishedYear: { type: String }, // Added for frontend compatibility
    pages: { type: Number }, // Added for frontend compatibility
    condition: { type: String, enum: ['new', 'like-new', 'very-good', 'good', 'acceptable'] }, // Added for frontend
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Book', bookSchema);