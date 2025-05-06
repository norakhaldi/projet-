import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import placeholderImage from '@/assets/placeholder-book.png'; // Local fallback image

function BookCard({ _id, title, author, price, coverImage, condition, sellerId }) {
  const { toast } = useToast();

  const handleWishlist = () => {
    toast({
      variant: 'destructive',
      title: 'Not Implemented',
      description: 'Wishlist functionality is not yet supported by the backend.',
    });
  };

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
          <Link to={`/books/${_id}`}>
            <button className="text-primary hover:text-primary/80">View Details</button>
          </Link>
          <button onClick={handleWishlist} className="text-gray-500 hover:text-primary">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;