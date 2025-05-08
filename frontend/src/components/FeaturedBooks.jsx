import React from 'react';
import BookCard from './BookCard';

function FeaturedBooks({
  title = 'Featured Books',
  subtitle = 'Discover handpicked titles from our collection',
  books = [],
}) {
  return (
    <section className="py-12 paper-texture">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-maroon mb-3">{title}</h2>
          <p className="text-gray-600 max-w-xl mx-auto">{subtitle}</p>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No {title.toLowerCase()} available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        )}
      </div>
    </section>
  );
}

export default FeaturedBooks;