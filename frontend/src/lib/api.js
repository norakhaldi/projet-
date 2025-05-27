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
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Book operations
export const getBooks = () => api.get('/books');
export const getBook = (id) => api.get(`/books/${id}`);
export const createBook = (bookData) =>
    api.post('/books', bookData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getUser = () => api.get('/auth/profile');

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (item) => api.post('/cart/add', item);
export const updateCart = (itemId, quantity) =>
    api.put(`/cart/${itemId}`, { quantity });
export const removeFromCart = (itemId) => api.delete(`/cart/${itemId}`);

// User-specific books
export const getUserListings = () => api.get('/books/user/listings');

// ✅ New: Orders and Purchases
export const getUserOrders = () => api.get('/orders');

export const getUserPurchases = () => api.get('/orders/purchases').then(res => res.data);

export default api;
// Redirection globale si token expiré (401 Unauthorized)
api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login'; // Redirige vers la page de connexion
      }
      return Promise.reject(error);
    }
  );
  