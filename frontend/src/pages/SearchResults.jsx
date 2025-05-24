import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import BookCard from "@/components/BookCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery().get("q") || "";
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setBooks([]);
      setLoading(false);
      return;
    }

    const fetchBooks = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/search?q=${encodeURIComponent(query)}`);
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif font-bold text-maroon mb-2">
          Résultats de recherche
        </h1>
        <p className="text-lg text-gray-600">
          Affichage des résultats pour <span className="font-semibold text-primary">"{query}"</span>
        </p>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-500 animate-pulse">Chargement des livres...</p>
      ) : books.length === 0 ? (
        <div className="text-center text-gray-500 text-xl font-medium mt-16">
          Aucun résultat trouvé pour "<span className="text-primary">{query}</span>".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {books.map((book) => (
            <BookCard key={book._id} {...book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
