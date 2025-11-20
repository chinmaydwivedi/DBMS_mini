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
  getTopSelling: (limit?: number, category_id?: number) => 
    api.get('/products/top-selling', { params: { limit, category_id } }),
  getById: (id: number) => api.get(`/products/${id}`),
  updatePrice: (id: number, new_price: number) => 
    api.put(`/products/${id}/price`, { new_price }),
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

// Sellers API
export const sellersAPI = {
  getAll: () => api.get('/sellers'),
  getById: (id: number) => api.get(`/sellers/${id}`),
  getCommission: (id: number, start_date: string, end_date: string) => 
    api.get(`/sellers/${id}/commission`, { params: { start_date, end_date } }),
  getTopProducts: (id: number, limit?: number) => 
    api.get(`/sellers/${id}/top-products`, { params: { limit } }),
};

// Returns API
export const returnsAPI = {
  getByUserId: (userId: number) => api.get(`/returns/user/${userId}`),
  getById: (id: number) => api.get(`/returns/${id}`),
  create: (data: any) => api.post('/returns', data),
  updateStatus: (id: number, status: string) => api.put(`/returns/${id}/status`, { status }),
};

// Membership API
export const membershipAPI = {
  getPlans: () => api.get('/membership/plans'),
  getUserMembership: (userId: number) => api.get(`/membership/user/${userId}`),
  subscribe: (data: any) => api.post('/membership/subscribe', data),
  cancel: (userId: number) => api.put(`/membership/cancel/${userId}`),
  getBenefits: (planId: number) => api.get(`/membership/benefits/${planId}`),
};

// Support API
export const supportAPI = {
  getByUserId: (userId: number) => api.get(`/support/user/${userId}`),
  getById: (id: number) => api.get(`/support/${id}`),
  create: (data: any) => api.post('/support', data),
  updateStatus: (id: number, status: string) => api.put(`/support/${id}/status`, { status }),
  addResponse: (id: number, response: string) => api.post(`/support/${id}/response`, { response }),
};

// Addresses API
export const addressesAPI = {
  getByUserId: (userId: number) => api.get(`/addresses/user/${userId}`),
  getById: (id: number) => api.get(`/addresses/${id}`),
  create: (data: any) => api.post('/addresses', data),
  update: (id: number, data: any) => api.put(`/addresses/${id}`, data),
  delete: (id: number) => api.delete(`/addresses/${id}`),
  setDefault: (id: number) => api.put(`/addresses/${id}/set-default`),
};

export default api;

