import React from 'react';
import { Link } from 'react-router-dom';

function BookCard({ _id, title, author, price, coverImage, condition, sellerId }) {
  return (
    <Link to={`/books/${_id}`} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
      <div className="flex flex-col items-center">
        <img
          src={coverImage || '/placeholder-book.jpg'}
          alt={title}
          className="w-full h-32 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-serif font-semibold text-maroon truncate w-full text-center">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">by {author}</p>
        <p className="text-primary font-bold mb-2">DA{price.toFixed(2)}</p>
        <p className="text-gray-500 text-sm">Condition: {condition}</p>
        {sellerId && typeof sellerId === 'object' && sellerId.username ? (
          <p className="text-gray-500 text-sm">Seller: {sellerId.username}</p>
        ) : (
          <p className="text-gray-500 text-sm">Seller: {sellerId}</p>
        )}
      </div>
    </Link>
  );
}

export default BookCard;