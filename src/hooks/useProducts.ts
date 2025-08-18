import { useState, useEffect } from 'react';
import { Product, ProductsResponse, ProductFilters, Category } from '../types';
import { productService } from '../services/api';
import useDebounce from './useDebounce';

interface UseProductsReturn {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  searchProducts: (query: string) => Promise<void>;
  loadMoreProducts: () => Promise<void>;
  updateProduct: (id: number, productData: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  filterProducts: (filters: ProductFilters) => void;
  refreshProducts: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentSkip, setCurrentSkip] = useState(0);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const loadProducts = async (skip = 0, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      let response: ProductsResponse;

      if (debouncedSearch) {
        response = await productService.searchProducts(debouncedSearch);
      } else if (filters.category) {
        response = await productService.getProductsByCategory(filters.category);
      } else {
        response = await productService.getProducts(skip, 20);
      }

      let filteredProducts = response.products;

      // Apply price filters
      if (filters.minPrice > 0 || filters.maxPrice < 10000) {
        filteredProducts = filteredProducts.filter(
          product => product.price >= filters.minPrice && product.price <= filters.maxPrice
        );
      }

      if (reset) {
        setProducts(filteredProducts);
        setCurrentSkip(20);
      } else {
        setProducts(prev => [...prev, ...filteredProducts]);
        setCurrentSkip(prev => prev + 20);
      }

      setHasMore(response.products.length === 20 && !debouncedSearch);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  useEffect(() => {
    loadProducts(0, true);
  }, [debouncedSearch, filters.category, filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    loadCategories();
  }, []);

  const searchProducts = async (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const loadMoreProducts = async () => {
    if (!loading && hasMore) {
      await loadProducts(currentSkip, false);
    }
  };

  const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product | null> => {
    try {
      setError(null);
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(prev =>
        prev.map(product =>
          product.id === id ? { ...product, ...updatedProduct } : product
        )
      );
      return updatedProduct;
    } catch (err) {
      setError('Failed to update product. Please try again.');
      console.error('Error updating product:', err);
      return null;
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete product. Please try again.');
      console.error('Error deleting product:', err);
      return false;
    }
  };

  const filterProducts = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const refreshProducts = async () => {
    setCurrentSkip(0);
    await loadProducts(0, true);
  };

  return {
    products,
    categories,
    loading,
    error,
    hasMore,
    searchProducts,
    loadMoreProducts,
    updateProduct,
    deleteProduct,
    filterProducts,
    refreshProducts,
  };
};