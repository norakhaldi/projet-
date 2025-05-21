const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true, min: 1, validate: {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer value for quantity'
  }},
  price: { type: Number, required: true, min: 0 },
  title: { type: String, required: true },
  author: { type: String, required: true },
  coverImage: { type: String },
  condition: { 
    type: String, 
    enum: ['new', 'like-new', 'very-good', 'good', 'acceptable'], 
    required: true 
  },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', cartSchema);