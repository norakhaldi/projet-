import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Sending token:', token);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Book operations
export const getBooks = () => api.get('/books');
export const getBook = (id) => api.get(`/books/${id}`);
export const createBook = (bookData) =>
  api.post('/books', bookData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateBook = (id, bookData) =>
  api.put(`/books/${id}`, bookData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getUser = () => api.get('/auth/profile');
export const updateProfile = (profileData) => api.put('/auth/profile', profileData);

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (item) => api.post('/cart/add', item);
export const updateCart = (itemId, quantity) =>
  api.put(`/cart/${itemId}`, { quantity });
export const removeFromCart = (itemId) => api.delete(`/cart/${itemId}`);

// User-specific books
export const getUserListings = () => api.get('/books/user/listings');

// Orders
export const getUserOrders = async () => {
  try {
    const response = await api.get('/orders');
    console.log('Fetched orders:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error.response?.data || error.message);
    throw error;
  }
};
export const deleteOrder = (orderId) => api.delete(`/orders/${orderId}`);

// Purchases
export const getUserPurchases = async () => {
  try {
    const response = await api.get('/orders/purchases');
    console.log('Fetched purchases:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching purchases:', error.response?.data || error.message);
    throw error;
  }
};

export default api;