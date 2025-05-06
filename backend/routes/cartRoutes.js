const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, cartController.getCart);
router.post('/add', authenticate, cartController.addToCart);
router.put('/:itemId', authenticate, cartController.updateCartItem);
router.delete('/:itemId', authenticate, cartController.removeFromCart);

module.exports = router;