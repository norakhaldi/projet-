import React from 'react';
import BookCard from './BookCard';

// Fallback data for Featured Books with new cover images
const defaultFeaturedBooks = [
  { _id: '1', title: 'A Game of Thrones', author: 'George R.R. Martin', price: 29.00, coverImage: 'https://images.unsplash.com/photo-1589820296156-2454bb8a64ad?w=400', condition: 'like-new', sellerId: 'seller1', category: 'fantasy' },
  { _id: '2', title: 'Cards on the Table', author: 'Agatha Christie', price: 15.00, coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', condition: 'like-new', sellerId: 'seller2', category: 'mystery' },
  { _id: '3', title: 'The Curious Incident of the Dog in the Night-Time', author: 'Mark Haddon', price: 40.00, coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', condition: 'like-new', sellerId: 'seller3', category: 'fiction' },
];

function FeaturedBooks({
  title = 'Featured Books',
  subtitle = 'Discover handpicked titles from our collection',
  books = [],
}) {
  // Use defaultFeaturedBooks if books prop is empty
  const displayBooks = books.length > 0 ? books : defaultFeaturedBooks;

  return (
    <section className="py-12 paper-texture">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-maroon mb-3">{title}</h2>
          <p className="text-gray-600 max-w-xl mx-auto">{subtitle}</p>
        </div>

        {displayBooks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No {title.toLowerCase()} available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayBooks.map((book) => (
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
        )}
      </div>
    </section>
  );
}

// Composant pour Recently Added avec différentes catégories
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