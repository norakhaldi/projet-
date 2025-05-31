import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { jwtDecode } from 'jwt-decode';
import { formatPrice } from '@/lib/formatPrice';
function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(null); // null = loading, false = not admin, true = admin
  const [books, setBooks] = useState([]);
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
  });
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const { toast } = useToast();
  const navigate = useNavigate();
  const formRef = useRef(null); // Ref for the form

  // Persistent logging function
  const logToStorage = (message) => {
    try {
      const logs = JSON.parse(localStorage.getItem('debugLogs') || '[]');
      logs.push({ timestamp: new Date().toISOString(), message });
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50); // Keep only the last 50 logs
      }
      localStorage.setItem('debugLogs', JSON.stringify(logs));
    } catch (error) {
      console.warn('Log storage failed (QuotaExceededError):', error.message);
    }
    console.log(message); // Always log to console
  };

  // Admin check and fetch books
  useEffect(() => {
    logToStorage('AdminDashboard: Component mounted');
    const token = localStorage.getItem('token');
    logToStorage(`AdminDashboard: Token found: ${token ? 'Yes' : 'No'}`);

    if (!token) {
      logToStorage('AdminDashboard: No token found, redirecting to login');
      setIsAdmin(false);
      return;
    }

    try {
      const payload = jwtDecode(token);
      logToStorage(`AdminDashboard: Decoded payload: ${JSON.stringify(payload)}`);
      if (payload.role && payload.role.toLowerCase() === 'admin') {
        logToStorage('AdminDashboard: User is admin');
        setIsAdmin(true);
        fetchBooks();
      } else {
        logToStorage('AdminDashboard: User is not admin, redirecting to login');
        setIsAdmin(false);
      }
    } catch (error) {
      logToStorage(`AdminDashboard: Token decoding error: ${error.message}`);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Token invalide. Veuillez vous reconnecter.',
      });
      setIsAdmin(false);
    }
  }, [navigate]);

  // Fetch all books
  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    logToStorage(`fetchBooks: Starting request with token: ${token ? 'Yes' : 'No'}`);
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      logToStorage(`fetchBooks: Response status: ${response.status}`);
      const data = await response.json();
      logToStorage(`fetchBooks: Response data: ${JSON.stringify(data)}`);
      if (response.ok) {
        setBooks(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

      } else {
        setError(data.message || 'Erreur lors de la récupération des livres.');
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: data.message || 'Erreur lors de la récupération des livres.',
        });
        if (response.status === 401) {
          logToStorage('fetchBooks: Unauthorized, redirecting to login');
          setIsAdmin(false);
        }
      }
    } catch (error) {
      logToStorage(`fetchBooks: Error: ${error.name} - ${error.message}`);
      setError('Erreur réseau.');
      toast({ variant: 'destructive', title: 'Erreur', description: 'Erreur réseau.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Create book
  const createBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
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
    if (e.target.image.files[0]) {
      formDataToSend.append('image', e.target.image.files[0]);
    }

    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });
      logToStorage(`createBook: Response status: ${response.status}`);
      const data = await response.json();
      logToStorage(`createBook: Response data: ${JSON.stringify(data)}`);
      if (response.ok) {
        toast({ title: 'Succès', description: 'Livre créé avec succès.' });
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
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: data.message || 'Erreur lors de la création du livre.',
        });
      }
    } catch (error) {
      logToStorage(`createBook: Error: ${error.message}`);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Erreur réseau.' });
    }
  };

  // Update book
  const updateBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
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
    if (e.target.image.files[0]) {
      formDataToSend.append('image', e.target.image.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/books/${selectedBook._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });
      logToStorage(`updateBook: Response status: ${response.status}`);
      const data = await response.json();
      logToStorage(`updateBook: Response data: ${JSON.stringify(data)}`);
      if (response.ok) {
        toast({ title: 'Succès', description: 'Livre mis à jour.' });
        fetchBooks();
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
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: data.message || 'Erreur lors de la mise à jour du livre.',
        });
      }
    } catch (error) {
      logToStorage(`updateBook: Error: ${error.message}`);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Erreur réseau.' });
    }
  };

  // Delete book
  const deleteBook = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      logToStorage(`deleteBook: Response status: ${response.status}`);
      const data = await response.json();
      logToStorage(`deleteBook: Response data: ${JSON.stringify(data)}`);
      if (response.ok) {
        toast({ title: 'Succès', description: 'Livre supprimé.' });
        fetchBooks();
      } else {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: data.message || 'Erreur lors de la suppression du livre.',
        });
      }
    } catch (error) {
      logToStorage(`deleteBook: Error: ${error.message}`);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Erreur réseau.' });
    }
  };

  // Populate form and scroll to form when selectedBook changes
  useEffect(() => {
    if (selectedBook) {
      logToStorage(`Populating form with book: ${selectedBook.title}`);
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
      });
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
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
      });
    }
  }, [selectedBook]);

  // Render based on isAdmin state
  if (isAdmin === null) {
    logToStorage('AdminDashboard: Rendering loading state');
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    logToStorage('AdminDashboard: Not admin, rendering Navigate to /login');
    return <Navigate to="/login" />;
  }

  logToStorage('AdminDashboard: Rendering dashboard');
  return (
    <div>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6 text-black">Tableau de bord Admin - Gestion des Livres</h1>

        {/* Form for Create/Update */}
        <form
          ref={formRef}
          onSubmit={selectedBook ? updateBook : createBook}
          className="bg-white p-6 rounded-lg shadow-md mb-6 border-2 border-primary" // Updated border to primary
          encType="multipart/form-data"
        >
          <h2 className="text-xl font-semibold mb-4 text-black">{selectedBook ? 'Modifier un livre' : 'Ajouter un livre'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Titre */}
            <div className="flex flex-col">
              <label htmlFor="title" className="mb-1 font-medium text-black">Titre</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titre"
                className="border p-2 rounded"
                required
              />
            </div>

            {/* Auteur */}
            <div className="flex flex-col">
              <label htmlFor="author" className="mb-1 font-medium text-black">Auteur</label>
              <input
                type="text"
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Auteur"
                className="border p-2 rounded"
                required
              />
            </div>

            {/* Description */}
            <div className="flex flex-col col-span-2">
              <label htmlFor="description" className="mb-1 font-medium text-black">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                className="border border-primary p-2 rounded" // Added border-primary
              />
            </div>

            {/* Prix */}
            <div className="flex flex-col">
              <label htmlFor="price" className="mb-1 font-medium text-black">Prix</label>
              <input
                type="number"
                id="price"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Prix"
                className="border border-primary p-2 rounded" // Added border-primary
                required
              />
            </div>

            {/* Catégorie */}
            <div className="flex flex-col">
              <label htmlFor="category" className="mb-1 font-medium text-black">Categories</label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Catégorie"
                className="border border-primary p-2 rounded" // Already has border, updated to border-primary
              />
            </div>

            {/* ISBN */}
            <div className="flex flex-col">
              <label htmlFor="isbn" className="mb-1 font-medium text-black">ISBN</label>
              <input
                type="text"
                id="isbn"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="ISBN"
                className="border p-2 rounded"
              />
            </div>

            {/* Année de publication */}
            <div className="flex flex-col">
              <label htmlFor="publishedYear" className="mb-1 font-medium text-black">date de publication</label>
              <input
                type="text"
                id="publishedYear"
                value={formData.publishedYear}
                onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                placeholder="Année de publication"
                className="border border-primary p-2 rounded" // Already has border, updated to border-primary
              />
            </div>

            {/* Nombre de pages */}
            <div className="flex flex-col">
              <label htmlFor="pages" className="mb-1 font-medium text-black">Nombre de pages</label>
              <input
                type="number"
                id="pages"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                placeholder="Nombre de pages"
                className="border border-primary p-2 rounded" // Added border-primary
              />
            </div>

            {/* Condition */}
            <div className="flex flex-col">
              <label htmlFor="condition" className="mb-1 font-medium text-black">Condition</label>
              <select
                id="condition"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="border border-primary p-2 rounded" // Added border-primary
              >
                <option value="new">New</option>
                <option value="like-new">like-new</option>
                <option value="very-good">very-good</option>
                <option value="good">good</option>
                <option value="acceptable">acceptable</option>
              </select>
            </div>

            {/* Image */}
            <div className="flex flex-col col-span-2">
              <label htmlFor="image" className="mb-1 font-medium text-black">Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.files[0] })}
                className="border p-2 rounded"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit" className="bg-primary text-white mr-2">
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
                  });
                }}
                className="bg-primary text-white"
              >
                Annuler
              </Button>
            )}
          </div>
        </form>

        {/* Books List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Liste des Livres</h2>
          {isLoading ? (
            <div className="text-center py-4">Chargement des livres...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-600">
              Erreur lors du chargement des livres : {error}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {books.map((book) => (
  <div key={book._id} className="border p-4 rounded">
    <h3 className="font-bold">{book.title}</h3>
    <p>Author: {book.author}</p>
    <p>Prix: {formatPrice(book.price)}</p>
    <p>Seller: {book.sellerId?.username || 'N/A'}</p>
    {book.coverImage && (
      <img src={book.coverImage} alt={book.title} className="w-20 h-20 object-cover mt-2" />
    )}
    <div className="mt-2 space-x-2">
      <Button
        onClick={() => {
          logToStorage(`Modifying book: ${book.title}`);
          setSelectedBook(book);
        }}
        className="bg-primary text-white"
      >
        Modifier
      </Button>
      <Button
        onClick={() => deleteBook(book._id)}
        className="bg-primary text-white"
      >
        Supprimer
      </Button>
      <Button
        onClick={() => navigate(`/book/${book._id}`)}
        className="bg-primary text-white"
      >
        Voir les détails
      </Button>
    </div>
  </div>
))}

            </div>
          ) : (
            <div className="text-center py-4">Aucun livre trouvé.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;