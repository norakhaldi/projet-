const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// GET /api/orders - récupère les commandes (achats) de l'utilisateur connecté
router.get('/', auth.authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.userId })
      .populate('items')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('❌ Erreur get orders :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/orders - créer une commande
router.post('/', auth.authenticate, async (req, res) => {
  const { items, fullName, address, city, postalCode, phone, email } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Aucun article dans la commande' });
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
      shipping: { fullName, address, city, postalCode, phone, email },
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

// GET /api/orders/purchases - commandes (achats) de l'utilisateur (déjà existant)
router.get('/purchases', auth.authenticate, async (req, res) => {
  try {
    const purchases = await Order.find({ buyerId: req.user.userId })
      .populate('items')
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    console.error('❌ Erreur get purchases :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/orders/sales - ventes de l'utilisateur (déjà existant)
router.get('/sales', auth.authenticate, async (req, res) => {
  try {
    const sales = await Order.find({ sellerId: req.user.userId })
      .populate('items')
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    console.error('❌ Erreur get sales :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
