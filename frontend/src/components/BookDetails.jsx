import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getBook, addToCart } from '@/lib/api';
import { Heart, ShoppingCart } from 'lucide-react';

function BookDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id).then(res => res.data),
  });

  const addToCartMutation = useMutation({
    mutationFn: () => addToCart({ bookId: id, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast({
        title: "Success",
        description: `${book?.title} has been added to your cart.`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to add to cart.",
      });
    },
  });

  const handleAddToWishlist = () => {
    toast({
      variant: "destructive",
      title: "Not Implemented",
      description: "Wishlist functionality is not yet supported by the backend.",
    });
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading book details...</div>;
  }

  if (error || !book) {
    return <div className="text-center py-12">Book not found.</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <img
              src={book.coverImage || '/placeholder-book.jpg'}
              alt={book.title}
              className="w-full h-[500px] object-cover rounded-lg shadow-md"
            />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold mb-4">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            <p className="text-2xl font-bold text-primary mb-4">${book.price.toFixed(2)}</p>
            <p className="text-gray-700 mb-6">{book.description || 'No description available.'}</p>
            <div className="mb-6">
              <p><strong>Condition:</strong> {book.condition}</p>
              {book.isbn && <p><strong>ISBN:</strong> {book.isbn}</p>}
              {book.publishedYear && <p><strong>Published:</strong> {book.publishedYear}</p>}
              {book.pages && <p><strong>Pages:</strong> {book.pages}</p>}
              {book.category && <p><strong>Category:</strong> {book.category}</p>}
              {book.sellerId && <p><strong>Seller:</strong> {book.sellerId.username}</p>}
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => addToCartMutation.mutate()}
                className="bg-primary text-white hover:bg-primary/90"
                disabled={addToCartMutation.isLoading}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {addToCartMutation.isLoading ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookDetail;