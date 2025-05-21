import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { jwtDecode } from 'jwt-decode';

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
  const { toast } = useToast();
  const navigate = useNavigate();

  // Persistent logging function
  const logToStorage = (message) => {
    const logs = JSON.parse(localStorage.getItem('debugLogs') || '[]');
    logs.push({ timestamp: new Date().toISOString(), message });
    localStorage.setItem('debugLogs', JSON.stringify(logs));
    console.log(message);
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
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      logToStorage(`fetchBooks: Response status: ${response.status}`);
      const data = await response.json();
      logToStorage(`fetchBooks: Response data: ${JSON.stringify(data)}`);
      if (response.ok) {
        setBooks(data);
      } else {
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
      logToStorage(`fetchBooks: Error: ${error.message}`);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Erreur réseau.' });
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
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord Admin - Gestion des Livres</h1>

        {/* Form for Create/Update */}
        <form
          onSubmit={selectedBook ? updateBook : createBook}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
          encType="multipart/form-data"
        >
          <h2 className="text-xl font-semibold mb-4">{selectedBook ? 'Modifier un livre' : 'Ajouter un livre'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Auteur"
              className="border p-2 rounded"
              required
            />
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
              className="border p-2 rounded col-span-2"
            />
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Prix"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Catégorie"
              className="border p-2 rounded"
            />
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              placeholder="ISBN"
              className="border p-2 rounded"
            />
            <input
              type="text"
              value={formData.publishedYear}
              onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
              placeholder="Année de publication"
              className="border p-2 rounded"
            />
            <input
              type="number"
              value={formData.pages}
              onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
              placeholder="Nombre de pages"
              className="border p-2 rounded"
            />
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="new">Neuf</option>
              <option value="like-new">Comme neuf</option>
              <option value="very-good">Très bon</option>
              <option value="good">Bon</option>
              <option value="acceptable">Acceptable</option>
            </select>
            <input
              type="file"
              name="image"
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.files[0] })}
              className="border p-2 rounded col-span-2"
            />
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
                className="bg-gray-500 text-white"
              >
                Annuler
              </Button>
            )}
          </div>
        </form>

        {/* Books List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Liste des Livres</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <div key={book._id} className="border p-4 rounded">
                <h3 className="font-bold">{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Price: ${book.price}</p>
                <p>Seller: {book.sellerId?.username || 'N/A'}</p>
                {book.coverImage && (
                  <img src={book.coverImage} alt={book.title} className="w-20 h-20 object-cover mt-2" />
                )}
                <div className="mt-2">
                  <Button
                    onClick={() => {
                      setSelectedBook(book);
                      setFormData({
                        title: book.title,
                        author: book.author,
                        description: book.description,
                        price: book.price,
                        category: book.category,
                        isbn: book.isbn,
                        publishedYear: book.publishedYear,
                        pages: book.pages,
                        condition: book.condition,
                      });
                    }}
                    className="mr-2 bg-blue-500 text-white"
                  >
                    Modifier
                  </Button>
                  <Button
                    onClick={() => deleteBook(book._id)}
                    className="bg-red-500 text-white"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;