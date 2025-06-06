const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Order = require('../models/order');
const { authenticate, isAdmin } = require('../middleware/auth');

// GET /api/orders - Get orders for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.userId })
      .populate('items')
      .populate('buyerId', 'username')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('❌ Erreur get orders :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/orders/all - Get all orders (admin only)
router.get('/all', authenticate, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('items', 'title price')
      .populate('buyerId', 'username')
      .populate('sellerId', 'username')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('❌ Erreur get all orders :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de toutes les commandes.' });
  }
});

// POST /api/orders - Create an order
router.post('/', authenticate, async (req, res) => {
  const { items, shipping, paymentMethod } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Aucun article dans la commande' });
  }

  if (!shipping || !shipping.fullName || !shipping.address || !shipping.phone) {
    return res.status(400).json({ error: 'Informations d\'expédition incomplètes' });
  }

  try {
    const updatedBooks = [];

    for (const item of items) {
      const book = await Book.findById(item._id);

      if (!book) {
        return res.status(404).json({ error: `Livre non trouvé: ${item._id}` });
      }

      if (book.sold) {
        return res.status(400).json({ error: `Livre déjà vendu: ${book.title}` });
      }

      book.sold = true;
      await book.save();
      updatedBooks.push(book);
    }

    const sellerId = updatedBooks[0].sellerId;

    const newOrder = new Order({
      buyerId: req.user.userId,
      sellerId: sellerId,
      items: updatedBooks.map(book => book._id),
      shipping: {
        fullName: shipping.fullName,
        address: shipping.address,
        phone: shipping.phone,
        city: shipping.city || 'N/A',
        postalCode: shipping.postalCode || 'N/A',
      },
      paymentMethod: paymentMethod,
      createdAt: new Date(),
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Commande validée, livres marqués comme vendus.',
      books: updatedBooks,
      order: newOrder,
    });
  } catch (error) {
    console.error('❌ Erreur commande :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/orders/purchases - Get user purchases
router.get('/purchases', authenticate, async (req, res) => {
  try {
    const purchases = await Order.find({ buyerId: req.user.userId })
      .populate('items')
      .populate('buyerId', 'username')
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    console.error('❌ Erreur get purchases :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/orders/sales - Get user sales
router.get('/sales', authenticate, async (req, res) => {
  try {
    const sales = await Order.find({ sellerId: req.user.userId })
      .populate('items')
      .populate('buyerId', 'username')
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    console.error('❌ Erreur get sales :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/orders/:id - Delete an order
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items');
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Check if the user is either the buyer or the seller
    if (
      order.buyerId.toString() !== req.user.userId &&
      order.sellerId.toString() !== req.user.userId &&
      req.user.role !== 'admin' // Add admin role check
    ) {
      return res.status(403).json({ error: 'Non autorisé à supprimer cette commande' });
    }

    // Mark the books as unsold
    for (const item of order.items) {
      item.sold = false;
      await item.save();
    }

    // Delete the order
    await Order.deleteOne({ _id: req.params.id });

    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la commande :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;