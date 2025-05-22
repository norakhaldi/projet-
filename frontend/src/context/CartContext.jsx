import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book) => {
    const exists = cartItems.some(item => item._id === book._id);
    if (!exists) {
      setCartItems((prev) => [...prev, book]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter(item => item._id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount: cartItems.length }}>
      {children}
    </CartContext.Provider>
  );
}
