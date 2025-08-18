import React from 'react';
import { Category, ProductFilters } from '../types';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  categories: Category[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onFiltersChange,
  isOpen,
  onClose,
}) => {
  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? '' : category,
    });
  };

  const handlePriceRangeChange = (minPrice: number, maxPrice: number) => {
    onFiltersChange({
      ...filters,
      minPrice,
      maxPrice,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: 10000,
    });
  };

  const hasActiveFilters = filters.category || filters.minPrice > 0 || filters.maxPrice < 10000;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static top-0 right-0 h-full bg-white border-l lg:border-l-0 lg:border-r border-gray-200 
        w-80 lg:w-64 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onClose}
                className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Categories</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === ''}
                  onChange={() => handleCategoryChange('')}
                  className="text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category.slug} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category.slug}
                    onChange={() => handleCategoryChange(category.slug)}
                    className="text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700 capitalize">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Price Range</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceRangeChange(
                      Number(e.target.value),
                      filters.maxPrice
                    )}
                    min="0"
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceRangeChange(
                      filters.minPrice,
                      Number(e.target.value)
                    )}
                    min="0"
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              
              {/* Quick price filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Under $50', min: 0, max: 50 },
                  { label: '$50-$100', min: 50, max: 100 },
                  { label: '$100-$500', min: 100, max: 500 },
                  { label: 'Over $500', min: 500, max: 10000 },
                ].map(({ label, min, max }) => (
                  <button
                    key={label}
                    onClick={() => handlePriceRangeChange(min, max)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      filters.minPrice === min && filters.maxPrice === max
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;