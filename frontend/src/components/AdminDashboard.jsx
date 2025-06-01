import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { jwtDecode } from 'jwt-decode';
import { formatPrice } from '@/lib/formatPrice';
import { getBooks, createBook, updateBook, getAllOrders, deleteOrder } from '@/lib/api';

function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    category: '',
    isbn: '',
    publishedYear: '',
    pages: '',
    condition: 'new',
    coverImage: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('books');
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Check admin status and fetch data
  useEffect(() => {
    console.log('AdminDashboard: Component mounted');
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('AdminDashboard: No token, redirecting to login');
      setIsAdmin(false);
      return;
    }

    try {
      const payload = jwtDecode(token);
      console.log('AdminDashboard: Decoded payload:', payload);
      if (payload.role && payload.role.toLowerCase() === 'admin') {
        setIsAdmin(true);
        if (activeTab === 'books') {
          fetchBooks();
        } else if (activeTab === 'orders') {
          fetchOrders();
        }
      } else {
        console.log('AdminDashboard: Not admin, redirecting to login');
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('AdminDashboard: Token decode error:', error);
      alert('Erreur : Token invalide. Veuillez vous reconnecter.');
      setIsAdmin(false);
    }
  }, [activeTab]);

  // Fetch books
  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getBooks();
      console.log('fetchBooks: Response:', response);
      console.log('fetchBooks: Books:', response.data);
      if (Array.isArray(response.data)) {
        setBooks(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        console.error('fetchBooks: Response data is not an array:', response.data);
        setError('Données invalides reçues du serveur.');
        alert('Erreur : Données invalides reçues du serveur.');
      }
    } catch (error) {
      console.error('fetchBooks: Error:', error);
      const message = error.response?.data?.message || 'Erreur lors de la récupération des livres.';
      setError(message);
      alert(message);
      if (error.response?.status === 401) {
        setIsAdmin(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    setIsOrdersLoading(true);
    setError(null);
    try {
      const response = await getAllOrders();
      console.log('fetchOrders: Response:', response);
      console.log('fetchOrders: Orders:', response.data);
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error('fetchOrders: Response data is not an array:', response.data);
        setError('Données invalides reçues du serveur.');
        alert('Erreur : Données invalides reçues du serveur.');
      }
    } catch (error) {
      console.error('fetchOrders: Error:', error);
      const message = error.response?.data?.message || 'Erreur lors de la récupération des commandes.';
      setError(message);
      alert(message);
      if (error.response?.status === 401) {
        setIsAdmin(false);
      }
    } finally {
      setIsOrdersLoading(false);
    }
  };

  // Create book
  const handleCreateBook = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.price) {
      alert('Erreur : Titre, auteur et prix sont requis.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('author', formData.author);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('isbn', formData.isbn);
    formDataToSend.append('publishedYear', formData.publishedYear);
    formDataToSend.append('pages', formData.pages);
    formDataToSend.append('condition', formData.condition);
    if (formData.coverImage) {
      formDataToSend.append('coverImage', formData.coverImage);
    }
    if (e.target.image.files[0]) {
      formDataToSend.append('image', e.target.image.files[0]);
    }

    console.log('createBook: Sending FormData:', [...formDataToSend.entries()]);

    try {
      const response = await createBook(formDataToSend);
      console.log('createBook: Response:', response.data);
      alert('Livre créé avec succès.');
      fetchBooks();
      setFormData({
        title: '',
        author: '',
        description: '',
        price: '',
        category: '',
        isbn: '',
        publishedYear: '',
        pages: '',
        condition: 'new',
        coverImage: '',
      });
    } catch (error) {
      console.error('createBook: Error:', error);
      alert(error.response?.data?.message || 'Erreur lors de la création du livre.');
    }
  };

  // Update book
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.price) {
      alert('Erreur : Titre, auteur et prix sont requis.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('author', formData.author);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('isbn', formData.isbn);
    formDataToSend.append('publishedYear', formData.publishedYear);
    formDataToSend.append('pages', formData.pages);
    formDataToSend.append('condition', formData.condition);
    if (formData.coverImage) {
      formDataToSend.append('coverImage', formData.coverImage);
    }
    if (e.target.image.files[0]) {
      formDataToSend.append('image', e.target.image.files[0]);
    }

    console.log('updateBook: Sending FormData:', [...formDataToSend.entries()]);

    try {
      const response = await updateBook(selectedBook._id, formDataToSend);
      console.log('updateBook: Response:', response.data);
      if (response.data.title !== formData.title) {
        console.warn('updateBook: Title not updated:', response.data.title, 'vs', formData.title);
        alert('Erreur : Le titre n’a pas été mis à jour sur le serveur. Vérifiez les logs.');
        try {
          const bookResponse = await fetch(`http://localhost:5000/api/books/${selectedBook._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const bookData = await bookResponse.json();
          console.log('updateBook: Fetched book after update:', bookData);
        } catch (error) {
          console.error('updateBook: Fetch book error:', error);
        }
      } else {
        alert('Livre modifié avec succès.');
      }
      await fetchBooks();
      setSelectedBook(null);
      setFormData({
        title: '',
        author: '',
        description: '',
        price: '',
        category: '',
        isbn: '',
        publishedYear: '',
        pages: '',
        condition: 'new',
        coverImage: '',
      });
    } catch (error) {
      console.error('updateBook: Error:', error);
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour du livre.');
      await fetchBooks();
    }
  };

  // Delete book
  const handleDeleteBook = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) return;
    try {
      await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('deleteBook: Book deleted:', id);
      alert('Livre supprimé avec succès.');
      fetchBooks();
    } catch (error) {
      console.error('deleteBook: Error:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression du livre.');
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return;
    setDeletingOrderId(orderId);
    try {
      await deleteOrder(orderId);
      console.log('deleteOrder: Order deleted:', orderId);
      alert('Commande supprimée avec succès.');
      fetchOrders();
    } catch (error) {
      console.error('deleteOrder: Error:', error);
      alert(error.response?.data?.message || 'Erreur lors de la suppression de la commande.');
    } finally {
      setDeletingOrderId(null);
    }
  };

  // Populate form for editing
  useEffect(() => {
    if (selectedBook) {
      console.log('Populating form with book:', selectedBook);
      setFormData({
        title: selectedBook.title || '',
        author: selectedBook.author || '',
        description: selectedBook.description || '',
        price: selectedBook.price || '',
        category: selectedBook.category || '',
        isbn: selectedBook.isbn || '',
        publishedYear: selectedBook.publishedYear || '',
        pages: selectedBook.pages || '',
        condition: selectedBook.condition || 'new',
        coverImage: selectedBook.coverImage || '',
      });
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setFormData({
        title: '',
        author: '',
        description: '',
        price: '',
        category: '',
        isbn: '',
        publishedYear: '',
        pages: '',
        condition: 'new',
        coverImage: '',
      });
    }
  }, [selectedBook]);

  // Render states
  if (isAdmin === null) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-secondary/10 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6 text-primary">Tableau de bord Admin</h1>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 rounded-md ${activeTab === 'books' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Gestion des Livres
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-md ${activeTab === 'orders' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Commandes
            </button>
          </nav>
        </div>

        {activeTab === 'books' && (
          <>
            {/* Form for Create/Update */}
            <form
              ref={formRef}
              onSubmit={selectedBook ? handleUpdateBook : handleCreateBook}
              className="bg-white p-6 rounded-lg shadow-md mb-6 border border-primary"
              encType="multipart/form-data"
            >
              <h2 className="text-xl font-semibold mb-4 text-primary">
                {selectedBook ? 'Modifier un livre' : 'Ajouter un livre'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Entrez le titre"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Entrez l'auteur"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Entrez la description"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows="4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Entrez le prix"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Entrez la catégorie"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="Entrez l'ISBN"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Année de publication</label>
                  <input
                    type="number"
                    name="publishedYear"
                    value={formData.publishedYear}
                    onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                    placeholder="Entrez l'année"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    placeholder="Entrez le nombre de pages"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="new">Neuf</option>
                    <option value="like-new">Comme neuf</option>
                    <option value="very-good">Très bon</option>
                    <option value="good">Bon</option>
                    <option value="acceptable">Acceptable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="Entrez l'URL de l'image"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nouvelle Image</label>
                  <input
                    type="file"
                    name="image"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  type="submit"
                  className="bg-[#7A1C27] text-white hover:bg-[#7A1C27]/90"
                >
                  {selectedBook ? 'Mettre à jour' : 'Ajouter'}
                </Button>
                {selectedBook && (
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedBook(null);
                      setFormData({
                        title: '',
                        author: '',
                        description: '',
                        price: '',
                        category: '',
                        isbn: '',
                        publishedYear: '',
                        pages: '',
                        condition: 'new',
                        coverImage: '',
                      });
                    }}
                    className="bg-[#7A1C27] text-white hover:bg-[#7A1C27]/90"
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </form>

            {/* Books List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-primary">Liste des Livres</h2>
              {isLoading ? (
                <div className="text-center py-4">Chargement des livres...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-600">Erreur : {error}</div>
              ) : books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {books.map((book) => (
                    <div key={book._id} className="border p-4 rounded">
                      <h3 className="font-bold text-primary">{book.title}</h3>
                      <p>Auteur: {book.author}</p>
                      <p>Prix: {formatPrice(book.price)}</p>
                      <p>Vendeur: {book.sellerId?.username || 'N/A'}</p>
                      {book.coverImage && (
                        <img src={book.coverImage} alt={book.title} className="w-20 h-20 object-cover mt-2" />
                      )}
                      <div className="mt-2 flex space-x-2">
                        <Button
                          onClick={() => {
                            console.log('Editing book:', book);
                            setSelectedBook(book);
                          }}
                          className="bg-[#7A1C27] text-white hover:bg-[#7A1C27]/90"
                        >
                          Modifier
                        </Button>
                        <Button
                          onClick={() => handleDeleteBook(book._id)}
                          className="bg-[#7A1C27] text-white hover:bg-[#7A1C27]/90"
                        >
                          Supprimer
                        </Button>
                        <Button
                          onClick={() => navigate(`/book/${book._id}`)}
                          className="bg-[#7A1C27] text-white hover:bg-[#7A1C27]/90"
                        >
                          Détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">Aucun livre trouvé.</div>
              )}
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-primary">Liste des Commandes</h2>
            {isOrdersLoading ? (
              <div className="text-center py-4">Chargement des commandes...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-600">Erreur : {error}</div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border text-left">Acheteur</th>
                      <th className="py-2 px-4 border text-left">Livre(s) acheté(s)</th>
                      <th className="py-2 px-4 border text-left">Date</th>
                      <th className="py-2 px-4 border text-left">Adresse</th>
                      <th className="py-2 px-4 border text-left">Téléphone</th>
                      <th className="py-2 px-4 border text-left">Paiement</th>
                      <th className="py-2 px-4 border text-left">Total</th>
                      <th className="py-2 px-4 border text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const totalPrice = order.items.reduce((sum, item) => sum + (item.price || 0), 0);
                      return (
                        <tr key={order._id} className="border-t">
                          <td className="py-2 px-4 border">{order.buyerId?.username || 'N/A'}</td>
                          <td className="py-2 px-4 border">
                            <ul className="list-disc ml-4">
                              {order.items.map((item) => (
                                <li key={item._id}>{item.title}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-2 px-4 border">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="py-2 px-4 border">
                            {order.shipping?.address || 'N/A'}
                            {order.shipping?.city && `, ${order.shipping.city}`}
                            {order.shipping?.postalCode && ` ${order.shipping.postalCode}`}
                          </td>
                          <td className="py-2 px-4 border">{order.shipping?.phone || 'N/A'}</td>
                          <td className="py-2 px-4 border">{order.paymentMethod || 'N/A'}</td>
                          <td className="py-2 px-4 border">{formatPrice(totalPrice)}</td>
                          <td className="py-2 px-4 border">
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteOrder(order._id)}
                              disabled={deletingOrderId === order._id}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              {deletingOrderId === order._id ? 'Suppression...' : 'Supprimer'}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">Aucune commande trouvée.</div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;