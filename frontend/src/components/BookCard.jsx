import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatPrice';

function BookCard(props) {
  const { toast } = useToast();
  const { addToCart } = useCart();

  const book = props.book || props;
  const {
    _id,
    title,
    author,
    price,
    coverImage,
    condition,
    sellerId,
    isInWishlist,
    onRemoveFromWishlist
  } = book;

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const existing = wishlist.find(item => item._id === _id);
    if (!existing) {
      wishlist.push({ _id, title, author, price, coverImage, condition, sellerId });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      toast({
        title: 'Ajouté à la Wishlist',
        description: `${title} a été ajouté à votre wishlist.`,
      });
    } else {
      toast({
        title: 'Déjà dans la Wishlist',
        description: `${title} est déjà présent.`,
      });
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({ _id, title, author, price, coverImage, condition, sellerId });
    toast({
      title: 'Ajouté au Panier',
      description: `${title} a été ajouté à votre panier.`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 relative">
      <Link to={`/books/${_id}`} className="block">
        <div className="flex flex-col items-center">
          <img
            src={coverImage || '/placeholder-book.jpg'}
            alt={title}
            className="w-full h-48 object-contain rounded-md mb-4"
          />
          <h3 className="text-lg font-serif font-semibold text-maroon truncate w-full text-center">{title}</h3>
          <p className="text-gray-600 text-sm mb-2">by {author}</p>
          <p className="text-primary font-bold mb-2">{formatPrice(price)}</p>
          <p className="text-gray-500 text-sm">Condition: {condition}</p>
          {sellerId && typeof sellerId === 'object' && sellerId.username ? (
            <p className="text-gray-500 text-sm">Seller: {sellerId.username}</p>
          ) : (
            <p className="text-gray-500 text-sm">Seller: {sellerId || "Unknown"}</p>
          )}
        </div>
      </Link>

      <div className="flex justify-center space-x-6 mt-4">
        {isInWishlist ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              onRemoveFromWishlist?.();
            }}
            className="text-white bg-red-600 p-2 rounded-full hover:bg-red-700 transition"
            aria-label="Remove from Wishlist"
          >
            ❌
          </button>
        ) : (
          <>
            <button
              onClick={handleAddToWishlist}
              className="text-white bg-maroon p-2 rounded-full hover:bg-red-600 transition"
              aria-label="Add to Wishlist"
            >
              <Heart className="h-6 w-6" />
            </button>
            <button
              onClick={handleAddToCart}
              className="text-white bg-maroon p-2 rounded-full hover:bg-green-600 transition"
              aria-label="Add to Cart"
            >
              <ShoppingCart className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default BookCard;
