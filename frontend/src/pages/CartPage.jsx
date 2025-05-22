import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center p-4 border rounded-md shadow-sm"
              >
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.author}</p>
                  <p className="text-primary font-bold">DA{item.price.toFixed(2)}</p>
                </div>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-100"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Link to="/books">
            <Button variant="outline" className="border-primary text-white hover:bg-primary/10">
              Continue Shopping
            </Button>
          </Link>
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={() => alert('Checkout not implemented yet.')}
          >
            confirm Purchase
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;
