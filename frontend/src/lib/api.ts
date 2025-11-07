import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getBestsellers: () => api.get('/products/bestsellers'),
  getById: (id: number) => api.get(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: number) => api.get(`/categories/${id}`),
};

// Flash Deals API
export const flashDealsAPI = {
  getAll: () => api.get('/flash-deals'),
  getById: (id: number) => api.get(`/flash-deals/${id}`),
};

// Cart API
export const cartAPI = {
  get: (userId: number) => api.get(`/cart/${userId}`),
  add: (userId: number, data: any) => api.post(`/cart/${userId}/add`, data),
  update: (userId: number, data: any) => api.put(`/cart/${userId}/update`, data),
  remove: (userId: number, itemId: number) => api.delete(`/cart/${userId}/remove/${itemId}`),
  clear: (userId: number) => api.delete(`/cart/${userId}/clear`),
};

// Wishlist API
export const wishlistAPI = {
  get: (userId: number) => api.get(`/wishlist/${userId}`),
  add: (userId: number, data: any) => api.post(`/wishlist/${userId}/add`, data),
  remove: (userId: number, productId: number) => api.delete(`/wishlist/${userId}/remove/${productId}`),
};

// Orders API
export const ordersAPI = {
  getByUserId: (userId: number, status?: string) => 
    api.get(`/orders/user/${userId}`, { params: { status } }),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (orderData: any) => api.post('/orders', orderData),
};

// Users API
export const usersAPI = {
  getById: (id: number) => api.get(`/users/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getByProductId: (productId: number) => api.get(`/reviews/product/${productId}`),
  create: (data: any) => api.post('/reviews', data),
};

// Coupons API
export const couponsAPI = {
  getAll: () => api.get('/coupons'),
  validate: (data: any) => api.post('/coupons/validate', data),
};

export default api;

