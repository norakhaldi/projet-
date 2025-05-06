const Cart = require('../models/Cart');
const Book = require('../models/Book');

exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.userId }).populate('items.bookId');
        if (!cart) {
            cart = new Cart({ userId: req.user.userId, items: [] });
            await cart.save();
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du panier.', error });
    }
};

exports.addToCart = async (req, res) => {
    const { bookId, quantity } = req.body;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé.' });
        }

        let cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            cart = new Cart({ userId: req.user.userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.bookId.toString() === bookId);
        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({
                bookId,
                quantity: quantity || 1,
                price: book.price,
                title: book.title,
                author: book.author,
                coverImage: book.coverImage,
                condition: book.condition,
            });
        }

        cart.updatedAt = Date.now();
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout au panier.', error });
    }
};

exports.updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé.' });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Article non trouvé dans le panier.' });
        }

        if (quantity <= 0) {
            cart.items.pull(itemId);
        } else {
            item.quantity = quantity;
        }

        cart.updatedAt = Date.now();
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du panier.', error });
    }
};

exports.removeFromCart = async (req, res) => {
    const { itemId } = req.params;

    try {
        const cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Panier non trouvé.' });
        }

        cart.items.pull(itemId);
        cart.updatedAt = Date.now();
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'article.', error });
    }
};