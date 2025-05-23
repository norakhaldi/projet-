// routes/order.js
const express = require('express');
const router = express.Router();

// Exemple d'une fausse base de données (tu peux remplacer par MongoDB ou autre)
const orders = [];

router.post('/', (req, res) => {
  const { items, fullName, address, city, postalCode, phone, email } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Aucun article dans la commande' });
  }

  const newOrder = {
    id: Date.now(),
    items,
    fullName,
    address,
    city,
    postalCode,
    phone,
    email,
    createdAt: new Date(),
  };

  orders.push(newOrder);
  res.status(201).json({ message: 'Commande enregistrée', order: newOrder });
});

module.exports = router;
