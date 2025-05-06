import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShoppingCart from '@/components/ShoppingCart';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function CartPage() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">Your Shopping Cart</h1>
        <ShoppingCart />
        <div className="mt-8 flex justify-between">
          <Link to="/books">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Continue Shopping
            </Button>
          </Link>
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={() => alert('Checkout not implemented yet.')}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;