const Cart = require('../models/Cart');
const Book = require('../models/Book');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.bookId');
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart.', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  const { bookId, quantity = 1 } = req.body;

  // Validate quantity
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be a positive integer.' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.bookId.toString() === bookId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        bookId,
        quantity,
        price: book.price,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        condition: book.condition,
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json({ message: 'Item added to cart successfully.', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding to cart.', error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  // Validate quantity
  if (!Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ message: 'Quantity must be a non-negative integer.' });
  }

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    if (quantity === 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }

    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json({ message: 'Cart updated successfully.', cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Error updating cart.', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    cart.items.pull(itemId);
    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json({ message: 'Item removed from cart successfully.', cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error removing from cart.', error: error.message });
  }
};