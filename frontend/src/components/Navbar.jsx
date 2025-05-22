import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Initial state
  const user = { name: localStorage.getItem('username') || 'John Smith', email: 'john.smith@example.com' };
  const navigate = useNavigate();

  // Optional: Remove the storage event listener if you want to re-check localStorage on every render
  // Alternatively, you can keep this if you need cross-tab synchronization
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

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsLoggedIn(!!localStorage.getItem('token')); // Force re-check
      navigate('/', { replace: true });
    }
  };

  // Re-check isLoggedIn on every render to ensure it reflects localStorage changes
  const currentIsLoggedIn = !!localStorage.getItem('token');

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-maroon"> Books Emporium</span>
        </div>
        <div className="flex space-x-6 items-center">
          <Link to="/" className="text-gray-800 hover:text-maroon">Home</Link>
          <Link to="/books" className="text-gray-800 hover:text-maroon">Browse Books</Link>
          <Link to="/sell" className="text-gray-800 hover:text-maroon">Sell Books</Link>
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
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
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