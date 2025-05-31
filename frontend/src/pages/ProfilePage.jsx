import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Book as BookIcon, Package, Heart,
  Settings, LogOut, ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Footer from '@/components/Footer';
import BookCard from '@/components/BookCard';
import {
  getUser, getUserListings, getUserOrders, getUserPurchases, deleteOrder, updateProfile
} from '@/lib/api';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('listings');
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      getUser().then(res => {
        console.log('Fetched user data:', res.data);
        return {
          username: res.data.username,
          email: res.data.email || 'N/A',
          joined: new Date(res.data.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          }),
          booksListed: res.data.booksListed || 0,
          booksSold: res.data.booksSold || 0,
        };
      }),
    onSuccess: (data) => {
      setFormData(prev => ({
        ...prev,
        fullName: data.username,
        email: data.email !== 'N/A' ? data.email : '',
      }));
    },
    onError: (error) => {
      console.error('getUser error:', error);
      alert('Erreur : Impossible de charger les données utilisateur. Veuillez réessayer.');
    },
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
    alert('Livre retiré de votre liste de souhaits.');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      console.log('Profile update success:', data);
      queryClient.invalidateQueries(['user']);
      alert(formData.newPassword ? 'Mot de passe modifié avec succès.' : 'Profil mis à jour avec succès.');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
    },
    onError: (error) => {
      console.error('Profile update error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert(error.response.data.message?.includes('Token')
          ? 'Erreur : Session invalide ou expirée. Veuillez vous reconnecter.'
          : 'Erreur : Authentification requise.');
      } else if (error.response?.status === 400) {
        alert(error.response.data.message || 'Erreur : Échec de la mise à jour du profil.');
      } else {
        alert('Erreur : Service indisponible. Veuillez réessayer plus tard.');
      }
    },
  });

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted, formData:', formData);

    // Client-side validation
    if (formData.newPassword || formData.confirmNewPassword) {
      if (!formData.currentPassword) {
        console.log('Missing current password');
        alert('Erreur : Veuillez entrer votre mot de passe actuel.');
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        console.log('Passwords do not match');
        alert('Erreur : Les nouveaux mots de passe ne correspondent pas.');
        return;
      }
      if (formData.newPassword.length < 3) {
        console.log('Password too short');
        alert('Erreur : Le nouveau mot de passe doit contenir au moins 3 caractères.');
        return;
      }
    }

    // Prepare payload
    const profileData = {};
    if (formData.fullName && formData.fullName !== userData?.username) {
      profileData.username = formData.fullName;
    }
    if (formData.email && formData.email !== userData?.email && formData.email !== 'N/A') {
      profileData.email = formData.email;
    }
    if (formData.newPassword) {
      profileData.password = formData.newPassword;
      profileData.currentPassword = formData.currentPassword;
    }

    if (Object.keys(profileData).length === 0) {
      console.log('No changes to save');
      alert('Erreur : Aucun changement à enregistrer.');
      return;
    }

    console.log('Sending profileData:', profileData);
    updateProfileMutation.mutate(profileData);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Logout response:', response.status);
    //  alert('Vous avez été déconnecté.');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Erreur : Échec de la déconnexion. Veuillez réessayer.');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login', { replace: true });
    }
  };

  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['userOrders']);
      queryClient.invalidateQueries(['userPurchases']);
      alert('Commande supprimée avec succès.');
    },
    onError: (error) => {
      console.error('Delete order error:', error);
      alert(error.message || 'Erreur : Échec de la suppression de la commande.');
    },
    onSettled: () => {
      setDeletingOrderId(null);
    },
  });

  const handleDeleteOrder = (orderId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      return;
    }
    setDeletingOrderId(orderId);
    deleteOrderMutation.mutate(orderId);
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
                  <h2 className="text-xl font-bold text-primary">{userData.username}</h2>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Membre depuis {userData.joined}</p>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-4">
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-primary">{userData.booksListed}</div>
                      <div className="text-xs text-gray-500">Annonces</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-primary">{userData.booksSold}</div>
                      <div className="text-xs text-gray-500">Ventes</div>
                    </div>
                  </div>
                  <nav className="space-y-1">
                    {[
                      { key: 'listings', label: 'Mes annonces', icon: <BookIcon /> },
                      { key: 'orders', label: 'Commandes', icon: <Package /> },
                      { key: 'purchases', label: 'Achats', icon: <ShoppingBag /> },
                      { key: 'wishlist', label: 'Liste de souhaits', icon: <Heart /> },
                      { key: 'settings', label: 'Paramètres', icon: <Settings /> },
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
                    <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50">
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Déconnexion</span>
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
                    <h2 className="text-xl font-bold text-primary">Mes annonces</h2>
                    <Link to="/sell">
                      <Button className="bg-primary text-white hover:bg-primary/90">+ Ajouter une nouvelle annonce</Button>
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
                      <div className="text-center py-12">Aucune annonce</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-primary">Mes commandes</h2>
                  </div>
                  <div className="p-6">
                    {isOrdersLoading ? (
                      <div className="text-center py-12">Chargement des commandes...</div>
                    ) : orders?.length > 0 ? (
                      <ul className="space-y-4">
                        {orders.map(order => (
                          <li key={order._id} className="border p-4 rounded-md">
                            <p><strong>Date :</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p><strong>Articles :</strong></p>
                            <ul className="list-disc ml-6 mt-2">
                              {order.items.map(item => (
                                <li key={item._id}>
                                  {item.title} – <span className="text-sm text-gray-500">{item.author}</span>
                                </li>
                              ))}
                            </ul>
                            <p><strong>Adresse :</strong> {order.shipping?.address || 'N/A'}</p>
                            <p><strong>Téléphone :</strong> {order.shipping?.phone || 'N/A'}</p>
                            <p><strong>Méthode de paiement :</strong> {order.paymentMethod || 'N/A'}</p>
                            <Button
                              variant="destructive"
                              className="mt-2"
                              onClick={() => handleDeleteOrder(order._id)}
                              disabled={deletingOrderId === order._id}
                            >
                              {deletingOrderId === order._id ? 'Suppression...' : 'Supprimer la commande'}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12">Aucune commande</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'purchases' && (
                <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-primary">Mes achats</h2>
                  </div>
                  <div className="p-6">
                    {isPurchasesLoading ? (
                      <div className="text-center py-12">Chargement...</div>
                    ) : purchases?.data?.length > 0 ? (
                      <ul className="space-y-4">
                        {purchases.data.map(purchase => (
                          <li key={purchase._id} className="border p-4 rounded-md">
                            <p><strong>Date :</strong> {new Date(purchase.createdAt).toLocaleDateString()}</p>
                            <p><strong>Articles achetés :</strong></p>
                            <ul className="list-disc ml-6 mt-2">
                              {purchase.items.map(book => (
                                <li key={book._id}>
                                  {book.title} – <span className="text-sm text-gray-500">{book.author}</span>
                                </li>
                              ))}
                            </ul>
                            <Button
                              variant="destructive"
                              className="mt-2"
                              onClick={() => handleDeleteOrder(purchase._id)}
                              disabled={deletingOrderId === purchase._id}
                            >
                              {deletingOrderId === purchase._id ? 'Suppression...' : 'Supprimer la commande'}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12">Aucun achat</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-lg shadow-md border overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-primary">Votre liste de souhaits</h2>
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
                      <div className="text-center py-12">Votre liste de souhaits est vide</div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-white rounded-lg shadow-md border overflow-hidden p-6">
                  <h2 className="text-xl font-bold mb-4 text-primary">Paramètres du compte</h2>
                  <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Entrez votre nom complet"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A1C27] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Entrez votre email"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A1C27] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Entrez votre mot de passe actuel"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A1C27] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Entrez le nouveau mot de passe"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A1C27] bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                        placeholder="Confirmez le nouveau mot de passe"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7A1C27] bg-gray-50"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="mt-4 bg-[#7A1C27] text-white hover:bg-[#7A1C27]/90"
                      disabled={updateProfileMutation.isLoading}
                    >
                      {updateProfileMutation.isLoading ? 'Mise à jour...' : 'Enregistrer les modifications'}
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