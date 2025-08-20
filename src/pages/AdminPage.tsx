import React, { useCallback, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Eye } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductEditModal from '../components/ProductEditModal';
import ConfirmationModal from '../components/ConfirmationModal';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { products, loading, error, updateProduct, deleteProduct, refreshProducts,searchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (editingProduct) {
      const success = await updateProduct(editingProduct.id, productData);
      if (success) {
        setEditingProduct(null);
      }
    }
  };
  const handleSearch = useCallback((query: string) => {
    searchProducts(query);
  }, [searchProducts]);

  const handleConfirmDelete = async () => {
    if (deletingProduct) {
      const success = await deleteProduct(deletingProduct.id);
      if (success) {
        setDeletingProduct(null);
      }
    }
  };

  const handleCreateProduct = async (productData: Partial<Product>) => {
    // In a real app, you'd have a create product API endpoint
    console.log('Create product:', productData);
    setShowCreateModal(false);
    // Refresh products to show any changes
    refreshProducts();
  };

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Platform</h1>
              <p className="text-gray-600 mt-2">Manage your product catalog</p>
            </div>
            {/* <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button> */}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            /> */}
            <div className="w-full lg:w-full">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.title}
                            </div>
                            <div className="text-sm text-gray-500">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">${product.price.toFixed(2)}</div>
                          {product.discountPercentage > 0 && (
                            <div className="text-xs text-green-600">
                              -{product.discountPercentage.toFixed(0)}% off
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ⭐ {product.rating}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2 justify-end">
                          
                          <Link
                          to={`/products/${product.id}`}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                          <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first product'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        {editingProduct && (
          <ProductEditModal
            product={editingProduct}
            isOpen={true}
            onClose={() => setEditingProduct(null)}
            onSave={handleSaveProduct}
          />
        )}

        {showCreateModal && (
          <ProductEditModal
            product={null}
            isOpen={true}
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateProduct}
          />
        )}

        {deletingProduct && (
          <ConfirmationModal
            isOpen={true}
            onClose={() => setDeletingProduct(null)}
            onConfirm={handleConfirmDelete}
            title="Delete Product"
            message={`Are you sure you want to delete "${deletingProduct.title}"? This action cannot be undone.`}
            confirmText="Delete"
            confirmButtonClass="bg-red-600 hover:bg-red-700"
          />
        )}
      </div>
    </div>
  );
};

export default AdminPage;