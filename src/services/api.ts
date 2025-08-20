import axios, { AxiosRequestHeaders } from 'axios';
import { ProductsResponse, Product, Category, LoginCredentials, LoginResponse, ApiCart } from '../types';

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

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.token) {
        const headers: AxiosRequestHeaders = (config.headers ?? {}) as AxiosRequestHeaders;
        headers['Authorization'] = `Bearer ${userData.token}`;
        config.headers = headers;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const productService = {
  // Get all products with pagination
  getProducts: async (skip = 0, limit = 2): Promise<ProductsResponse> => {
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
  // Get user cart
  getUserCart: async (userId: number): Promise<ApiCart | null> => {
    const response = await api.get(`/carts/user/${userId}`);
    const carts = response.data.carts;
    return carts.length > 0 ? carts[0] : null;
  },

  // Add to cart
  addToCart: async (userId: number, products: Array<{ id: number; quantity: number }>): Promise<ApiCart> => {
    const response = await api.post('/carts/add', {
      userId,
      products,
    });
    return response.data;
  },

  // Update cart: DummyJSON PUT is unreliable; always POST to /carts/add
  updateCart: async (
    userId: number,
    _cartId: number | null,
    products: Array<{ id: number; quantity: number }>
  ): Promise<ApiCart> => {
    const response = await api.post('/carts/add', {
      userId,
      // some implementations support merge: true; include if backend ignores
      merge: true,
      products,
    });
    return response.data;
  },

  // Delete cart
  deleteCart: async (cartId: number): Promise<{ isDeleted: boolean; id: number }> => {
    const response = await api.delete(`/carts/${cartId}`);
    return response.data;
  },
};

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', {
      username: credentials.username,
      password: credentials.password,
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<LoginResponse> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};

export default api;
