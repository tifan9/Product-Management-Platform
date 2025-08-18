import axios from 'axios';
import { ProductsResponse, Product, Cart, Category } from '../types';

const BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const productService = {
  // Get all products with pagination
  getProducts: async (skip = 0, limit = 20): Promise<ProductsResponse> => {
    const response = await api.get(`/products?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string): Promise<ProductsResponse> => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get single product
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Update product
  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: number): Promise<{ isDeleted: boolean; id: number }> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<ProductsResponse> => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },
};

export const cartService = {
  // Get user carts
  getUserCarts: async (userId: number): Promise<Cart[]> => {
    const response = await api.get(`/carts/user/${userId}`);
    return response.data.carts;
  },

  // Add to cart
  addToCart: async (userId: number, products: Array<{ id: number; quantity: number }>): Promise<Cart> => {
    const response = await api.post('/carts/add', {
      userId,
      products,
    });
    return response.data;
  },

  // Update cart
  updateCart: async (cartId: number, products: Array<{ id: number; quantity: number }>): Promise<Cart> => {
    const response = await api.put(`/carts/${cartId}`, { products });
    return response.data;
  },

  // Delete cart
  deleteCart: async (cartId: number): Promise<{ isDeleted: boolean; id: number }> => {
    const response = await api.delete(`/carts/${cartId}`);
    return response.data;
  },
};

export default api;