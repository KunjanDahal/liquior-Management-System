import React from 'react';
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Mock data - will be replaced with real data from API
  const stats = [
    {
      title: "Today's Sales",
      value: '$0.00',
      icon: DollarSign,
      trend: '+0%',
      trendUp: true,
    },
    {
      title: 'Total Products',
      value: '0',
      icon: Package,
      trend: '+0',
      trendUp: true,
    },
    {
      title: 'Transactions',
      value: '0',
      icon: ShoppingCart,
      trend: '+0%',
      trendUp: true,
    },
    {
      title: 'Customers',
      value: '0',
      icon: Users,
      trend: '+0',
      trendUp: true,
    },
    {
      title: 'Low Stock Items',
      value: '0',
      icon: AlertTriangle,
      trend: '0',
      trendUp: false,
    },
    {
      title: 'Monthly Revenue',
      value: '$0.00',
      icon: TrendingUp,
      trend: '+0%',
      trendUp: true,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening at your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend} from yesterday
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn btn-primary">New Sale</button>
          <button className="btn btn-secondary">Add Product</button>
          <button className="btn btn-secondary">Add Customer</button>
          <button className="btn btn-secondary">View Reports</button>
        </div>
      </div>

      {/* Status Message */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">System Status</h3>
            <p className="text-sm text-blue-700 mt-1">
              Frontend foundation complete. Backend API and database need to be connected.
              Phase 1 (Foundation) is complete. Ready for Phase 2 (POS Module).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

