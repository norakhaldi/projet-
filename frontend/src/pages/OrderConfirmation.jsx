import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (!orderData) {
      navigate("/");
      return;
    }

    // Simulate order progression every 3 seconds
    const interval = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < statusSteps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [orderData, navigate]);

  if (!orderData) return null;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto border rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4 text-center text-primary">Order Confirmed </h1>

          <p className="text-lg mb-2">
            Thank you, <strong>{orderData.name}</strong>! Your order has been placed successfully.
          </p>
          

          <div className="bg-gray-100 rounded p-4 mb-4">
            <p><strong>Order ID:</strong> {orderData.orderId}</p>
            <p><strong>Delivery Address:</strong> {orderData.address}</p>
            <p><strong>Phone:</strong> {orderData.phone}</p>
            <p><strong>Payment Method:</strong> {orderData.paymentMethod}</p>
            <p className="mt-3 text-blue-600 font-semibold">
              Status: {statusSteps[statusIndex]}
            </p>
          </div>

          <p className="text-sm text-gray-500 text-center">
            You can close this page. Your order will be processed soon.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OrderConfirmation;
