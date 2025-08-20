import React, { useState, useCallback } from 'react';
import { Filter, Search } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductFilters } from '../types';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

const ProductsPage: React.FC = () => {
  const [viewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    products, 
    categories, 
    loading, 
    error, 
    searchProducts, 
    filterProducts,
    total,
    page,
    pageSize,
    setPage
  } = useProducts();

  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
  });

  const handleSearch = useCallback((query: string) => {
    searchProducts(query);
    setFilters(prev => ({ ...prev, search: query }));
  }, [searchProducts]);

  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
    filterProducts(newFilters);
  }, [filterProducts]);

  const toggleFilters = () => setShowFilters(!showFilters);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
          
          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="w-full lg:w-full">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <div className="flex items-center gap-3">
              {/* Filter Toggle */}
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors lg:hidden"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Filters Sidebar */}
          <FilterSidebar
            categories={categories}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Products Grid/List */}
            {loading && products.length === 0 ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">
                  {/* 🔍 */}
                {/* <Search size={64} /> */}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8'
                    : 'space-y-6'
                }>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      view={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <Pagination
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;