import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Home, 
  Settings, 
  Menu, 
  X, 
  User, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { totalQuantity, total } = useCart();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    // { path: '/', icon: Home, label: 'Home' },
    { path: '/', icon: Package, label: 'Products' },
    { path: '/admin', icon: Settings, label: 'Admin' },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg rounded-lg p-2 border border-gray-200"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-80 lg:w-72 flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Product Platform</span>
          </div>
        </div>

        {/* User Section */}
        <div className="p-6 border-b border-gray-200">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.image}
                  alt={user.firstName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Guest User</p>
                  <p className="text-sm text-gray-500">Not signed in</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'text-blue-600 bg-blue-50 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
                {isActive(path) && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            ))}
          </div>
        </nav>

        {/* Cart Summary */}
        <div className="p-6 border-t border-gray-200">
          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className={`block p-4 rounded-lg border-2 transition-colors ${
              isActive('/cart')
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Shopping Cart</span>
              </div>
              {totalQuantity > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {totalQuantity > 9 ? '9+' : totalQuantity}
                </span>
              )}
            </div>
            
            {totalQuantity > 0 ? (
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  {totalQuantity} item{totalQuantity !== 1 ? 's' : ''}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ${total.toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Your cart is empty</p>
            )}
          </Link>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          // Optionally show a success message or redirect
          console.log('Login successful!');
        }}
      />
    </>
  );
};

export default Sidebar;