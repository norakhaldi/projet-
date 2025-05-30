import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index.jsx";
import { CartProvider } from './context/CartContext';
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
import LogoutPage from './components/LogoutPage';
import AdminDashboard from './components/AdminDashboard';
import BookDetail from './components/BookDetail';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from "@/pages/OrderConfirmation";
import SearchResults from './pages/SearchResults';
import BooksList from './pages/BooksList';
import Layout from './layouts/Layout'; // <-- Import du Layout
import PrivateRoute from './components/PrivateRoute';
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartProvider>
            <Routes>
              {/* Toutes les routes enfants seront dans Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="/sell" element={
          <PrivateRoute>
            <SellPage />
          </PrivateRoute>
        } />
                <Route path="cart" element={<CartPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="shipping" element={<ShippingPolicy />} />
                <Route path="returns" element={<ReturnsExchanges />} />
                <Route path="contact" element={<Contact />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="logout" element={<LogoutPage />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="books/:id" element={<BookDetail />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="order-confirmation" element={<OrderConfirmation />} />
                <Route path="search" element={<SearchResults />} />
                <Route path="books" element={<BooksList />} />
                <Route path="/book/:id" element={<BookDetail />} />

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <div className="text-center p-10">
                      404 Oops! Page not found. <Link to="/">Return to Home</Link>
                    </div>
                  }
                />
              </Route>
            </Routes>
          </CartProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
