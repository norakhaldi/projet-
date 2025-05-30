import React, { useState } from "react";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/formatPrice";

function generateOrderId() {
  return "ORD" + Math.floor(Math.random() * 1000000);
}

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "cash",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = generateOrderId();
      const orderData = {
        orderId,
        ...formData,
      };

      clearCart();
      navigate("/order-confirmation", { state: orderData });
    }, 1500);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shippingCost = 5;
  const total = subtotal + shippingCost;

  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-primary">Checkout</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg flex-1">
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Shipping Address</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Phone Number</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="card">Card (Fake)</option>
                </select>
              </div>

              <Button
                type="submit"
                className="bg-primary text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm Purchase"}
              </Button>
            </form>

            {/* Order Summary & Shipping Info */}
            <div className="space-y-4 w-full md:w-80 md:ml-auto">
              {/* Order Summary */}
              <div className="border rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-3 text-primary">Order Summary</h2>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Shipping</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="border rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-3 text-primary">Shipping Information</h2>
                <p className="text-gray-600 text-sm mb-2">
                  Orders are typically processed within 1-2 business days and shipped via trusted carriers.
                </p>
               
               
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
