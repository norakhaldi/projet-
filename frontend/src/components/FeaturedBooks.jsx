import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';

function FeaturedBooks({
  title = 'Featured Books',
  subtitle = 'Discover handpicked titles from our collection',
}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeaturedBooks() {
      try {
        const response = await fetch('http://localhost:5000/api/books/featured');

        if (!response.ok) throw new Error('Failed to fetch featured books');
        const data = await response.json();
        setBooks(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Could not load featured books.');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedBooks();
  }, []);

  if (loading) {
    return (
      <section className="py-12 paper-texture">
        <div className="container mx-auto px-4 text-center">
          <p>Loading featured books...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 paper-texture">
        <div className="container mx-auto px-4 text-center text-red-600">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="py-12 paper-texture">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>No featured books available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 paper-texture">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-maroon mb-3">{title}</h2>
          <p className="text-gray-600 max-w-xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard
              key={book._id}
              _id={book._id}
              title={book.title}
              author={book.author}
              price={book.price}
              coverImage={book.coverImage}
              condition={book.condition}
              sellerId={book.sellerId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Composant RecentlyAddedBooks inchangé, tu peux le garder tel quel
function RecentlyAddedBooks({ books = [] }) {
  return (
    <section className="py-12 paper-texture">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-maroon mb-3">Recently Added Books</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Explore the latest additions to our collection</p>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No recently added books available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard
                key={book._id}
                _id={book._id}
                title={book.title}
                author={book.author}
                price={book.price}
                coverImage={book.coverImage || undefined}
                condition={book.condition}
                sellerId={book.sellerId}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedBooks;
export { RecentlyAddedBooks };
