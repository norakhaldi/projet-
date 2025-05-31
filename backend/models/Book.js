const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  coverImage: { type: String },
  filePath: { type: String },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  featured: { type: Boolean, default: false },
  category: { type: String },
  isbn: { type: String },
  publishedYear: { type: String },
  pages: { type: Number },
  condition: { type: String, enum: ['new', 'like-new', 'very-good', 'good', 'acceptable'] },
  sold: { type: Boolean, default: false }, // ✅ ajouté
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Book || mongoose.model('Book', bookSchema);
