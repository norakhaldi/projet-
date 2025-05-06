import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBook } from '@/lib/api';

const conditions = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'very-good', label: 'Very Good' },
  { value: 'good', label: 'Good' },
  { value: 'acceptable', label: 'Acceptable' },
];

function SellForm() {
  const [bookInfo, setBookInfo] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    price: '',
    condition: 'new',
    category: '',
    publishedYear: '',
    pages: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['userListings']);
      toast({
        title: "Success",
        description: "Your book has been listed for sale!",
      });
      setBookInfo({
        title: '',
        author: '',
        isbn: '',
        description: '',
        price: '',
        condition: 'new',
        category: '',
        publishedYear: '',
        pages: '',
        image: null,
      });
      setImagePreview(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to list book.",
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setBookInfo((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', bookInfo.title);
    formData.append('author', bookInfo.author);
    formData.append('isbn', bookInfo.isbn);
    formData.append('description', bookInfo.description);
    formData.append('price', bookInfo.price);
    formData.append('condition', bookInfo.condition);
    formData.append('category', bookInfo.category);
    formData.append('publishedYear', bookInfo.publishedYear);
    formData.append('pages', bookInfo.pages);
    if (bookInfo.image) {
      formData.append('image', bookInfo.image);
    }
    createBookMutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border border-secondary/50">
      <h2 className="text-2xl font-serif font-bold mb-6 text-primary">List Your Book for Sale</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Book Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={bookInfo.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter the book title"
            />
          </div>
          
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={bookInfo.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter the author's name"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={bookInfo.isbn}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter ISBN (optional)"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={bookInfo.price}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your asking price"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
              Condition *
            </label>
            <select
              id="condition"
              name="condition"
              value={bookInfo.condition}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {conditions.map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={bookInfo.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Fiction, Science, History"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-1">
              Published Year
            </label>
            <input
              type="text"
              id="publishedYear"
              name="publishedYear"
              value={bookInfo.publishedYear}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 2020"
            />
          </div>
          
          <div>
            <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
              Pages
            </label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={bookInfo.pages}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 300"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={bookInfo.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Describe the book's condition, edition, or any other relevant details"
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Book Cover Image
          </label>
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-gray-500">
                Upload a clear image of the book cover. Max size: 5MB
              </p>
            </div>
            {imagePreview && (
              <div className="w-24 h-32 overflow-hidden rounded-md border border-secondary">
                <img 
                  src={imagePreview} 
                  alt="Book cover preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary/90"
            disabled={createBookMutation.isLoading}
          >
            {createBookMutation.isLoading ? 'Listing Book...' : 'List Book for Sale'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SellForm;