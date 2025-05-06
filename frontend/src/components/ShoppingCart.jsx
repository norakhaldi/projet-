import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getCart, updateCart, removeFromCart } from '@/lib/api';
import { Trash2, Plus, Minus } from 'lucide-react';

function ShoppingCart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart().then(res => res.data),
  });

  const updateCartMutation = useMutation({
    mutationFn: ({ itemId, quantity }) => updateCart(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast({
        title: "Success",
        description: "Cart updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update cart.",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (itemId) => removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast({
        title: "Success",
        description: "Item removed from cart.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to remove item.",
      });
    },
  });

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity >= 1) {
      updateCartMutation.mutate({ itemId, quantity });
    }
  };

  const calculateSubtotal = () => {
    return cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Your cart is empty</h3>
        <p className="mt-1 text-gray-500">Add some books to your cart to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-secondary/30 p-6">
      <div className="space-y-6">
        {cart.items.map((item) => (
          <div key={item._id} className="flex items-center border-b border-secondary/20 pb-4">
            <img
              src={item.coverImage || '/placeholder-book.jpg'}
              alt={item.title}
              className="w-24 h-32 object-cover rounded-md mr-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="text-gray-600">{item.author}</p>
              <p className="text-gray-600">Condition: {item.condition}</p>
              <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-secondary rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1 || updateCartMutation.isLoading}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  disabled={updateCartMutation.isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeFromCartMutation.mutate(item._id)}
                disabled={removeFromCartMutation.isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div>
          <p className="text-lg font-medium">Subtotal:</p>
          <p className="text-2xl font-bold text-primary">${calculateSubtotal().toFixed(2)}</p>
        </div>
        <Button
          className="bg-primary text-white hover:bg-primary/90"
          onClick={() => alert('Checkout not implemented yet.')}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}

export default ShoppingCart;