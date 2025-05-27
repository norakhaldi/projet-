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
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handleApplyCoupon = () => {
    if (couponCode) {
      alert(`Coupon "${couponCode}" applied! (This is a placeholder)`);
    }
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
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

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

            {/* Order Summary, Coupon & Shipping Info */}
            <div className="space-y-4 w-full md:w-80 md:ml-auto">
              {/* Coupon Section */}
              <div className="border rounded-lg p-4 shadow-sm bg-red-100">
                <h2 className="text-lg font-semibold mb-3 text-red-800">Have a Coupon?</h2>
                <p className="text-gray-600 text-sm mb-3">
                  Enter your coupon code during checkout to receive your discount.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={handleCouponChange}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    className="bg-red-600 text-white text-sm px-3 py-1"
                    disabled={!couponCode}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
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
                <h2 className="text-lg font-semibold mb-3">Shipping Information</h2>
                <p className="text-gray-600 text-sm mb-2">
                  Orders are typically processed within 1-2 business days and shipped via trusted carriers.
                </p>
                <p className="text-sm mb-1">
                  <strong>Standard:</strong> 3-5 business days
                </p>
                <p className="text-sm mb-1">
                  <strong>Expedited:</strong> 1-3 business days
                </p>
                <p className="text-sm mb-1">
                  <strong>Free Shipping:</strong> Orders over DA5,000
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
