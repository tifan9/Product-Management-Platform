import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product, view = 'grid' }) => {
  const { addToCart, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  if (view === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-32 h-32 object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  to={`/products/${product.id}`}
                  className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {product.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="text-right ml-4">
                <div className="flex items-center gap-1 text-sm text-yellow-500 mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-gray-600">{product.rating}</span>
                </div>
                <div className="text-right">
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                  <div className="text-2xl font-bold text-gray-900">
                    ${discountedPrice.toFixed(2)}
                  </div>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-red-600 font-medium">
                      -{product.discountPercentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Stock: {product.stock}
              </span>
              <div className="flex gap-2">
                <Link
                  to={`/products/${product.id}`}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {quantity > 0 ? `In Cart (${quantity})` : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
      <Link to={`/products/${product.id}`} className="block relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            -{product.discountPercentage.toFixed(0)}%
          </div>
        )}
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <Link
              to={`/products/${product.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
            >
              {product.title}
            </Link>
            <p className="text-sm text-gray-500">{product.brand}</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-gray-600">{product.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-400 line-through mr-2">
                ${product.price.toFixed(2)}
              </span>
            )}
            <span className="text-xl font-bold text-gray-900">
              ${discountedPrice.toFixed(2)}
            </span>
          </div>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
        >
          <ShoppingCart className="w-4 h-4" />
          {quantity > 0 ? `In Cart (${quantity})` : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;