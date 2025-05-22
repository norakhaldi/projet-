import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index.jsx";
import { CartProvider } from './context/CartContext'; // ✅ CartProvider
import SellPage from "./pages/SellPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import FAQ from './pages/FAQ.jsx';
import ShippingPolicy from './pages/ShippingPolicy.jsx';
import ReturnsExchanges from './pages/ReturnsExchanges.jsx';
import Contact from './pages/Contact.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import Navbar from './components/Navbar';
import LogoutPage from './components/LogoutPage';
import AdminDashboard from './components/AdminDashboard';
import BookDetail from './components/BookDetail';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* ✅ Wrap all routes inside CartProvider */}
          <CartProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
              <Route path="/returns" element={<ReturnsExchanges />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route
                path="*"
                element={
                  <div>
                    404 Oops! Page not found. <Link to="/">Return to Home</Link>
                  </div>
                }
              />
            </Routes>
          </CartProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
