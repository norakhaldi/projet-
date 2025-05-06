const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        title: { type: String, required: true },
        author: { type: String, required: true },
        coverImage: { type: String },
        condition: { type: String },
    }],
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', cartSchema);