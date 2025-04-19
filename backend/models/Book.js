const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    coverImage: { type: String }, // URL de l'image de couverture
    filePath: { type: String },   // Chemin du fichier (PDF ou EPUB)
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Book', bookSchema);