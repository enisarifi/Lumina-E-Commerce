import React from 'react';
import { User, Product, Order } from '../types';
import { MOCK_ORDERS, MOCK_PRODUCTS, MOCK_USERS } from '../constants';
import { LayoutDashboard, ShoppingBag, Users, DollarSign, TrendingUp, Package, ArrowUpRight } from 'lucide-react';

interface AdminDashboardPageProps {
  user: User;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ user }) => {
  // Simple Mock Stats
  const totalRevenue = MOCK_ORDERS.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = MOCK_ORDERS.length + 124; // Mock historic count
  const totalProducts = MOCK_PRODUCTS.length;
  const totalUsers = MOCK_USERS.length + 45; // Mock historic count

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user.name}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">Export Report</button>
          <button className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">+ Add Product</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={<DollarSign size={20} className="text-green-600" />} 
          trend="+12.5%" 
          isPositive={true} 
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders.toString()} 
          icon={<ShoppingBag size={20} className="text-blue-600" />} 
          trend="+8.2%" 
          isPositive={true} 
        />
        <StatCard 
          title="Active Users" 
          value={totalUsers.toString()} 
          icon={<Users size={20} className="text-purple-600" />} 
          trend="+24.3%" 
          isPositive={true} 
        />
        <StatCard 
          title="Total Products" 
          value={totalProducts.toString()} 
          icon={<Package size={20} className="text-orange-600" />} 
          trend="-2.1%" 
          isPositive={false} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900">Recent Orders</h3>
            <button className="text-sm text-brand-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Order ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-lg text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_ORDERS.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{order.id}</td>
                    <td className="px-4 py-3 text-gray-500">{order.date}</td>
                    <td className="px-4 py-3 text-gray-500">{order.items.length} items</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                         order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                         order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                         order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
                       }`}>
                         {order.status}
                       </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-6">Top Selling Products</h3>
          <div className="space-y-6">
            {MOCK_PRODUCTS.slice(0, 4).map((product, idx) => (
              <div key={product.id} className="flex items-center gap-4">
                <span className="text-gray-400 font-bold w-4">{idx + 1}</span>
                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {120 - (idx * 15)} sales
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            View Performance Report
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, isPositive }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {trend} {isPositive ? <TrendingUp size={12} className="ml-1" /> : <TrendingUp size={12} className="ml-1 transform rotate-180" />}
      </div>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);