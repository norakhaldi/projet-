import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Book as BookIcon, Package, Heart, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookCard from '@/components/BookCard';
import { getUser, getUserListings } from '@/lib/api';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('listings');
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser().then(res => ({
      username: localStorage.getItem('username'),
      email: res.data.email || 'N/A',
      joined: new Date(res.data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      booksListed: res.data.booksListed || 0,
      booksSold: res.data.booksSold || 0,
    })),
  });

  const { data: userListedBooks, isLoading: isListingsLoading } = useQuery({
    queryKey: ['userListings'],
    queryFn: () => getUserListings().then(res => res.data),
  });

  useEffect(() => {
    if (activeTab === 'wishlist') {
      const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlistBooks(storedWishlist);
    }
  }, [activeTab]);

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    toast({
      variant: "destructive",
      title: "Not Implemented",
      description: "Profile updates are not yet supported by the backend.",
    });
  };

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

      if (!response.ok) throw new Error('Logout failed');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/', { replace: true });
    }
  };

  if (isUserLoading) {
    return <div className="text-center py-12">Loading user data...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="bg-secondary/10 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md border border-secondary/30 overflow-hidden">
                <div className="p-6 border-b border-secondary/30 text-center">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="font-serif text-xl font-bold">{userData?.username}</h2>
                  <p className="text-gray-600 text-sm">{userData?.email}</p>
                  <p className="text-gray-500 text-sm mt-1">Member since {userData?.joined}</p>
                </div>

                <div className="p-4">
                  <div className="flex justify-between mb-4">
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-primary">{userData?.booksListed}</div>
                      <div className="text-xs text-gray-500">Books Listed</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-primary">{userData?.booksSold}</div>
                      <div className="text-xs text-gray-500">Books Sold</div>
                    </div>
                  </div>

                  <nav className="space-y-1">
                    <button onClick={() => setActiveTab('listings')} className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${activeTab === 'listings' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}>
                      <BookIcon className="mr-3 h-5 w-5" />
                      <span>My Listings</span>
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}>
                      <Package className="mr-3 h-5 w-5" />
                      <span>Orders</span>
                    </button>
                    <button onClick={() => setActiveTab('purchases')} className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${activeTab === 'purchases' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}>
                      <ShoppingBag className="mr-3 h-5 w-5" />
                      <span>Purchases</span>
                    </button>
                    <button onClick={() => setActiveTab('wishlist')} className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${activeTab === 'wishlist' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}>
                      <Heart className="mr-3 h-5 w-5" />
                      <span>Wishlist</span>
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}>
                      <Settings className="mr-3 h-5 w-5" />
                      <span>Settings</span>
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50">
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {activeTab === 'listings' && (
                <div className="bg-white rounded-lg shadow-md border border-secondary/30 overflow-hidden">
                  <div className="p-6 border-b border-secondary/30 flex justify-between items-center">
                    <h2 className="font-serif text-xl font-bold">My Book Listings</h2>
                    <Link to="/sell">
                      <Button className="bg-primary text-white hover:bg-primary/90">+ Add New Listing</Button>
                    </Link>
                  </div>
                  <div className="p-6">
                    {isListingsLoading ? (
                      <div className="text-center py-12">Loading listings...</div>
                    ) : userListedBooks?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userListedBooks.map(book => (
                          <BookCard key={book._id} {...book} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BookIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium">No books listed yet</h3>
                        <p className="mt-1 text-gray-500">Get started by adding a new book listing.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-lg shadow-md border border-secondary/30 overflow-hidden">
                  <div className="p-6 border-b border-secondary/30">
                    <h2 className="font-serif text-xl font-bold">Your Wishlist</h2>
                  </div>
                  <div className="p-6">
                    {wishlistBooks.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlistBooks.map(book => (
                          <BookCard key={book._id} {...book} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium">Your wishlist is empty</h3>
                        <p className="mt-1 text-gray-500">Save books you're interested in by clicking the heart icon.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Other tabs unchanged... */}
              {/* orders, purchases, settings */}
              {/* ... */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;
