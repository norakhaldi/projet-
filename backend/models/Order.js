const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }],
  shipping: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    // email: { type: String, default: 'N/A' }, // Commenté ou supprimé si non nécessaire
  },
  paymentMethod: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);