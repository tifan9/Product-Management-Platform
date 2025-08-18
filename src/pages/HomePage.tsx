import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, TrendingUp, Users, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Package,
      title: 'Product Management',
      description: 'Complete CRUD operations for managing your product catalog',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: ShoppingBag,
      title: 'Shopping Cart',
      description: 'Seamless shopping experience with persistent cart functionality',
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Search',
      description: 'Lightning-fast product search with advanced filtering options',
      color: 'text-purple-600 bg-purple-100',
    },
    {
      icon: Users,
      title: 'User-friendly',
      description: 'Intuitive interface designed for the best user experience',
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  const stats = [
    { label: 'Products Available', value: '100+' },
    { label: 'Categories', value: '20+' },
    { label: 'Customer Rating', value: '4.9' },
    { label: 'Response Time', value: '<100ms' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Product Management
              <span className="block text-blue-200">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              A comprehensive platform for managing products, shopping cart functionality, 
              and delivering exceptional user experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                <Package className="w-5 h-5" />
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage products and provide an exceptional shopping experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore our product catalog or dive into the admin panel to manage your inventory.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Star className="w-5 h-5" />
              View Products
            </Link>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              View Cart
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;