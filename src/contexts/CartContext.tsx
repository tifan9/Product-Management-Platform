import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { cartService } from '../services/api';
import type { AxiosError } from 'axios';

interface CartState {
  items: CartItem[];
  total: number;
  totalQuantity: number;
  loading: boolean;
  error: string | null;
  cartId: number | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { items: CartItem[]; cartId: number | null } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SYNC_WITH_API'; payload: { items: CartItem[]; cartId: number } };

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: number) => number;
  syncCartWithAPI: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                total: (item.quantity + quantity) * item.discountedPrice
              }
            : item
        );
      } else {
        const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100);
        const newItem: CartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity,
          total: discountedPrice * quantity,
          discountPercentage: product.discountPercentage || 0,
          discountedPrice,
          thumbnail: product.thumbnail,
        };
        newItems = [...state.items, newItem];
      }

      return calculateTotals({ ...state, items: newItems, error: null });
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return calculateTotals({ ...state, items: newItems });
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }

      const newItems = state.items.map(item =>
        item.id === id
          ? { ...item, quantity, total: item.discountedPrice * quantity }
          : item
      );

      return calculateTotals({ ...state, items: newItems });
    }

    case 'CLEAR_CART':
      return { 
        items: [], 
        total: 0, 
        totalQuantity: 0, 
        loading: false, 
        error: null, 
        cartId: null 
      };

    case 'LOAD_CART':
      return calculateTotals({ 
        ...state, 
        items: action.payload.items, 
        cartId: action.payload.cartId 
      });

    case 'SYNC_WITH_API':
      return calculateTotals({
        ...state,
        items: action.payload.items,
        cartId: action.payload.cartId,
        loading: false,
        error: null,
      });

    default:
      return state;
  }
};

const calculateTotals = (state: CartState): CartState => {
  const total = state.items.reduce((sum, item) => sum + item.total, 0);
  const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  return { ...state, total, totalQuantity };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    totalQuantity: 0,
    loading: false,
    error: null,
    cartId: null,
  });

  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const { items, cartId } = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: { items: items || [], cartId: cartId || null } });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({
      items: state.items,
      cartId: state.cartId,
    }));
  }, [state.items, state.cartId]);

  // Sync with API when user logs in
  useEffect(() => {
    if (user && state.items.length > 0) {
      syncCartWithAPI();
    }
  }, [user]);

  const syncCartWithAPI = async () => {
    if (!user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Get existing cart from API
      const existingCart = await cartService.getUserCart(user.id);
      
      if (existingCart) {
        // Convert API cart items to our format
        const apiItems: CartItem[] = existingCart.products.map((item: CartItem) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
          discountPercentage: item.discountPercentage,
          discountedPrice: item.discountedPrice,
          thumbnail: item.thumbnail,
        }));
        
        dispatch({ 
          type: 'SYNC_WITH_API', 
          payload: { items: apiItems, cartId: existingCart.id } 
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error syncing cart with API:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sync cart' });
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: 'Please sign in to add items to cart' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Add to local state first for immediate UI feedback
      dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });

      // Prepare products for API call
      const existingItem = state.items.find(item => item.id === product.id);
      const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
      
      const products = [{ id: product.id, quantity: newQuantity }];

      let apiCart;
      if (state.cartId) {
        // Update existing cart with fallback behavior inside service
        apiCart = await cartService.updateCart(user.id, state.cartId, products);
      } else {
        // Create new cart
        apiCart = await cartService.addToCart(user.id, products);
      }

      // Update cart ID if we got a new one
      if (apiCart.id !== state.cartId) {
        dispatch({ 
          type: 'SYNC_WITH_API', 
          payload: { 
            items: state.items, // Keep current items since we already updated locally
            cartId: apiCart.id 
          } 
        });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: unknown) {
      console.error('Error adding to cart:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || 'Failed to add item to cart';
      dispatch({ 
        type: 'SET_ERROR', 
        payload: message
      });
    }
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (id: number) => {
    const item = state.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    syncCartWithAPI,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};