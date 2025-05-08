import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import placeholderImage from '@/assets/placeholder-book.png';

function BookCard({ _id, title, author, price, coverImage, condition, sellerId }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-secondary/30 overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/books/${_id}`}>
        <img
          src={coverImage || placeholderImage}
          alt={title || 'Book'}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/books/${_id}`}>
          <h3 className="text-lg font-medium truncate">{title || 'Unknown Title'}</h3>
          <p className="text-gray-600 truncate">{author || 'Unknown Author'}</p>
          <p className="text-primary font-bold">
            {typeof price === 'number' ? `$${price.toFixed(2)}` : 'Price unavailable'}
          </p>
          <p className="text-sm text-gray-500">Condition: {condition || 'Unknown'}</p>
          {sellerId && typeof sellerId === 'object' && sellerId.username && (
            <p className="text-sm text-gray-500">Seller: {sellerId.username}</p>
          )}
        </Link>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-maroon">
            {typeof price === 'number' ? `$${price.toFixed(2)}` : 'N/A'}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-maroon hover:text-white hover:bg-maroon border-maroon"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;