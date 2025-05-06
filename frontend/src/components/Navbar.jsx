import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual auth state

  return (
    <nav className="bg-white border-b border-secondary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Book className="h-8 w-8 text-primary mr-2" />
            <span className="font-serif text-2xl font-bold text-primary">Crimson Book Emporium</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-black hover:text-primary font-medium">Home</Link>
            <Link to="/books" className="text-black hover:text-primary font-medium">Browse</Link>
            <Link to="/sell" className="text-black hover:text-primary font-medium">Sell Books</Link>
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                className="pl-10 pr-4 py-2 rounded-full border border-secondary focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-black hover:text-primary" />
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            
            {isLoggedIn ? (
              <Link to="/profile">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  <User className="h-5 w-5 mr-2" />
                  My Account
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button className="bg-primary text-white hover:bg-primary/80">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative mr-4">
              <ShoppingCart className="h-6 w-6 text-black" />
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-4 space-y-3">
            <Link to="/" className="block px-3 py-2 text-black hover:bg-secondary rounded-md">Home</Link>
            <Link to="/books" className="block px-3 py-2 text-black hover:bg-secondary rounded-md">Browse</Link>
            <Link to="/sell" className="block px-3 py-2 text-black hover:bg-secondary rounded-md">Sell Books</Link>
            <div className="relative mt-3">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
            {!isLoggedIn && (
              <Link to="/login" className="block px-3 py-2 text-center bg-primary text-white rounded-md">
                Sign In
              </Link>
            )}
            {isLoggedIn && (
              <Link to="/profile" className="block px-3 py-2 text-center border border-primary text-primary rounded-md">
                My Account
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;