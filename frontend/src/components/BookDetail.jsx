import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedBooks from '@/components/FeaturedBooks';
import { getBook } from '@/lib/api';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

function BookDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const { addToCart } = useCart();

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id).then(res => res.data),
  });

  const handleAddToWishlist = () => {
    toast({
      variant: "destructive",
      title: "Non disponible",
      description: "La wishlist n'est pas encore prise en charge.",
    });
  };

  const handleAddToCart = () => {
    addToCart(book);
    toast({
      title: "Ajouté au panier",
      description: `${book.title} a été ajouté à votre panier.`,
    });
  };

  if (isLoading) return <div className="text-center py-12">Chargement...</div>;
  if (error || !book) return <div className="text-center py-12">Livre introuvable.</div>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="w-full min-h-[600px] flex justify-center items-center bg-white p-6 border rounded-lg shadow-md">
            <img
              src={book.coverImage || '/placeholder-book.jpg'}
              alt={book.title}
              className="max-h-[1000px] max-w-full object-contain"
              onError={(e) => e.target.src = '/placeholder-book.jpg'}
            />
          </div>

          <div>
            <h1 className="text-3xl font-serif font-bold mb-4">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">par {book.author}</p>
            <p className="text-2xl font-bold text-red-600 mb-4">DA{book.price.toFixed(2)}</p>
            <p className="text-gray-700 mb-6">{book.description || 'No Description .'}</p>
            <div className="mb-6 space-y-2">
              <p><strong>Title:</strong> {book.title}</p>
              <p><strong>Condition:</strong> <span className="text-green-600">{book.condition}</span></p>
              {book.isbn && <p><strong>ISBN:</strong> {book.isbn}</p>}
              {book.publishedYear && <p><strong>Year:</strong> {book.publishedYear}</p>}
              {book.pages && <p><strong>Pages:</strong> {book.pages}</p>}
              {book.category && <p><strong>Category:</strong> {book.category}</p>}
              {book.sellerId && (
                <p><strong>Seller:</strong> {book.sellerId.username} <span className="text-yellow-500">★★★★☆ (124)</span></p>
              )}
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleAddToCart} className="bg-red-600 text-white hover:bg-red-700">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" onClick={handleAddToWishlist} className="border-red-600 text-red-600 hover:bg-red-50">
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
        <div className="mb-12">
          <FeaturedBooks title="Vous aimerez aussi" subtitle="Suggestions basées sur ce livre" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookDetail;