import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import BookCard from '@/components/BookCard';

function BooksList() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get('q') || '';
  const category = params.get('category') || '';

  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      setSearchInput(query);
    } else if (category) {
      setSearchInput('');
    }
  }, [query, category]);

  const formatCategoryName = (slug) => {
    const map = {
      'sci-fi': 'Science Fiction',
      'top-picks': 'Top Picks',
      'world': 'World Reads',
      'classics': 'Classics',
      'thrillers': 'Thrillers',
      'romance': 'Romance',
      'novels': 'Novels',
      'learning': 'Learning',
      'nature': 'Nature',
      'science': 'Science',
      'history': 'History',
      'mathematics': 'Mathematics',
      'fiction': 'Fiction',
    };
    return map[slug?.toLowerCase()] || slug?.charAt(0).toUpperCase() + slug?.slice(1);
  };

  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books', query, category],
    queryFn: async () => {
      if (query || category) {
        const searchTerm = query || category;
        const response = await axios.get(
          `http://localhost:5000/api/books/search?q=${encodeURIComponent(searchTerm)}`
        );
        return response.data;
      } else {
        const response = await axios.get('http://localhost:5000/api/books');
        return response.data;
      }
    },
    keepPreviousData: true,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const titleText = query
    ? `Results for : "${query}"`
    : category
    ? `Results for category : "${formatCategoryName(category)}"`
    : 'All books';

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Formulaire de recherche */}
      <form onSubmit={handleSearch} className="mb-8 flex justify-center gap-4">
        <input
          type="text"
          placeholder="Rechercher un livre, auteur, ISBN..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:border-maroon"
        />
        <button
          type="submit"
          className="bg-maroon text-white px-6 py-2 rounded-lg hover:bg-maroon/90 transition"
        >
          Rechercher
        </button>
      </form>

      {/* Titre dynamique avec text-primary */}
      <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-center text-primary">
        {titleText}
      </h1>

      {isLoading ? (
        <div className="text-center py-12 text-primary">Chargement des livres...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">Erreur : {error.message}</div>
      ) : books.length === 0 ? (
        <p className="text-center text-primary">Aucun livre trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BooksList;
