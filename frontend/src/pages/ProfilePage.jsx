import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Book as BookIcon, Package, Heart,
  Settings, LogOut, ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import Footer from '@/components/Footer';
import BookCard from '@/components/BookCard';
import {
  getUser, getUserListings,
  getUserOrders, getUserPurchases
} from '@/lib/api';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('listings');
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: 'johnsmith@example.com', // Keeping this as a placeholder, you can remove or fetch from backend
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      getUser().then(res => ({
        username: res.data.username,
        email: res.data.email || 'N/A',
        joined: new Date(res.data.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        }),
        booksListed: res.data.booksListed || 0,
        booksSold: res.data.booksSold || 0,
      })),
  });

  const { data: userListedBooks, isLoading: isListingsLoading } = useQuery({
    queryKey: ['userListings'],
    queryFn: () => getUserListings().then(res => res.data),
  });

  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['userOrders'],
    queryFn: getUserOrders,
    enabled: activeTab === 'orders',
  });

  const { data: purchases, isLoading: isPurchasesLoading } = useQuery({
    queryKey: ['userPurchases'],
    queryFn: getUserPurchases,
    enabled: activeTab === 'purchases',
  });

  useEffect(() => {
    if (activeTab === 'wishlist') {
      const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlistBooks(storedWishlist);
    }
  }, [activeTab]);

  const handleRemoveFromWishlist = (id) => {
    const updatedWishlist = wishlistBooks.filter(book => book._id !== id);
    setWishlistBooks(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    toast({
      title: 'Retiré de la Wishlist',
      description: 'Le livre a été retiré de votre wishlist.',
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    // Basic validation for passwords
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas.",
      });
      return;
    }

    // Log form data (replace with backend API call later)
    console.log('Form submitted:', formData);

    toast({
      title: "Succès",
      description: "Les modifications ont été enregistrées. (Simulation - connectez au backend)",
    });

    // Optionally reset password fields after submission
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }));
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login', { replace: true });
    }
  };

  if (isUserLoading) return <div className="text-center py-12">Chargement du profil...</div>;

  return (
    <div>
      <div className="bg-secondary/10 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                <div className="p-6 border-b text-center">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">{userData.username}</h2>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Member since {userData.joined}</p>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-4">
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-primary">{userData.booksListed}</div>
                      <div className="text-xs text-gray-500">listings</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-primary">{userData.booksSold}</div>
                      <div className="text-xs text-gray-500">sells</div>
                    </div>
                  </div>
                  <nav className="space-y-1">
                    {[
                      { key: 'listings', label: 'My Listings', icon: <BookIcon /> },
                      { key: 'orders', label: 'Orders', icon: <Package /> },
                      { key: 'purchases', label: 'Purchases', icon: <ShoppingBag /> },
                      { key: 'wishlist', label: 'Wishlist', icon: <Heart /> },
                      { key: 'settings', label: 'Settings', icon: <Settings /> },
                    ].map(({ key, label, icon }) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${activeTab === key ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}
                      >
                        <span className="mr-3 h-5 w-5">{icon}</span>
                        <span>{label}</span>
                      </button>
                    ))}
                    <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 text-sm rounded-md text-white hover:bg-red-50 hover:text-primary ">
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="md:col-span-3 space-y-6">
              {activeTab === 'listings' && (
                <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                  <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">My Listings</h2>
                    <Link to="/sell">
                      <Button className="bg-primary text-white hover:bg-primary/90">+ Add New Listing</Button>
                    </Link>
                  </div>
                  <div className="p-6">
                    {isListingsLoading ? (
                      <div className="text-center py-12">Chargement...</div>
                    ) : userListedBooks?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userListedBooks.map(book => (
                          <BookCard key={book._id} {...book} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">no listing</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">My Orders</h2>
                  </div>
                  <div className="p-6">
                    {isOrdersLoading ? (
                      <div className="text-center py-12">Chargement des commandes...</div>
                    ) : orders?.data?.length > 0 ? (
                      <ul className="space-y-4">
                        {orders.data.map(order => (
                          <li key={order._id} className="border p-4 rounded-md">
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p><strong>Articles:</strong> {order.items.length}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12">Aucune commande.</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'purchases' && (
                <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">My Purchases</h2>
                  </div>
                  <div className="p-6">
                    {isPurchasesLoading ? (
                      <div className="text-center py-12">Chargement...</div>
                    ) : purchases?.data?.length > 0 ? (
                      <ul className="space-y-4">
                        {purchases.data.map(purchase => (
                          <li key={purchase._id} className="border p-4 rounded-md">
                            <p><strong>Date:</strong> {new Date(purchase.createdAt).toLocaleDateString()}</p>
                            <p><strong>Articles achetés:</strong></p>
                            <ul className="list-disc ml-6 mt-2">
                              {purchase.items.map(book => (
                                <li key={book._id}>
                                  {book.title} – <span className="text-sm text-gray-500">{book.author}</span>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12">Aucun achat.</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-primary">Your Wishlist</h2>
                  </div>
                  <div className="p-6">
                    {wishlistBooks.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistBooks.map(book => (
                          <BookCard
                            key={book._id}
                            {...book}
                            onRemoveFromWishlist={() => handleRemoveFromWishlist(book._id)}
                            isInWishlist
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">Votre wishlist est vide.</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-white rounded-lg shadow-md border overflow-hidden p-6">
                  <h2 className="text-xl font-bold mb-4 text-primary">Account Settings</h2>
                  <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Enter your current password"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="mt-4 bg-[#7A1C27] text-white hover:bg-[#7A1C27]/90"
                    >
                      Save Changes
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;