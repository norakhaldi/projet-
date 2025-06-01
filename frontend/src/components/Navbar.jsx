import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingCart } from 'lucide-react'; // 👈 Ajouté ShoppingCart
import { useCart } from '@/context/CartContext'; // 👈

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const user = { name: localStorage.getItem('username') || 'John Smith', email: 'john.smith@example.com' };
  const navigate = useNavigate();
  const { cartCount } = useCart(); // 👈 Assure-toi que CartProvider entoure <Routes /> dans App.jsx

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Logout failed');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
      navigate('/', { replace: true });
    }
  };

  const currentIsLoggedIn = !!localStorage.getItem('token');

  return (
    <nav className="bg-white shadow-md ">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center ">
        <div className="flex items-center ">
          <span className="text-2xl font-bold text-maroon">Books Emporium</span>
        </div>
        <div className="flex space-x-6 items-center">
          <Link to="/" className="text-gray-800 hover:text-maroon">Home</Link>
          <Link to="/books" className="text-gray-800 hover:text-maroon">Browse Books</Link>
          <Link to="/sell" className="text-gray-800 hover:text-maroon">Sell Books</Link>

          {/* 🛒 Panier */}
          <Link to="/cart" className="relative text-gray-800 hover:text-maroon">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-maroon text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {currentIsLoggedIn ? (
            <div className="relative group">
              <Link to="/profile" className="text-gray-800 hover:text-maroon flex items-center">
                <User
                  className="h-6 w-6 text-white mr-2"
                  style={{ backgroundColor: '#800000', borderRadius: '50%', padding: '4px' }}
                />
                <span>{user.name}</span>
              </Link>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-gray-800 hover:text-maroon">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
