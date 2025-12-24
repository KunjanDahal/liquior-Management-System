import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  Activity,
  CreditCard,
  Percent,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - will be replaced with real data from API
  const stats = [
    {
      title: "Today's Sales",
      value: '$2,847.50',
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
      change: '+$316.20',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Total Transactions',
      value: '47',
      icon: ShoppingCart,
      trend: '+8.2%',
      trendUp: true,
      change: '+4 sales',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Active Customers',
      value: '1,284',
      icon: Users,
      trend: '+3.1%',
      trendUp: true,
      change: '+38 this week',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Avg Transaction',
      value: '$60.59',
      icon: Activity,
      trend: '+4.3%',
      trendUp: true,
      change: '+$2.52',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
    {
      title: 'Total Products',
      value: '2,456',
      icon: Package,
      trend: '+2.8%',
      trendUp: true,
      change: '+67 items',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Low Stock Items',
      value: '23',
      icon: AlertTriangle,
      trend: '-12%',
      trendUp: false,
      change: '5 critical',
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ];

  const recentTransactions = [
    { id: '1001', customer: 'John Smith', amount: 45.99, time: '2 min ago', status: 'completed' },
    { id: '1002', customer: 'Sarah Johnson', amount: 128.50, time: '15 min ago', status: 'completed' },
    { id: '1003', customer: 'Mike Davis', amount: 89.00, time: '32 min ago', status: 'completed' },
    { id: '1004', customer: 'Emily Brown', amount: 215.75, time: '1 hour ago', status: 'completed' },
    { id: '1005', customer: 'Walk-in Customer', amount: 34.20, time: '1 hour ago', status: 'completed' },
  ];

  const topProducts = [
    { name: 'Premium Coffee Beans', sold: 45, revenue: '$585.00', trend: 12 },
    { name: 'Organic Tea Set', sold: 38, revenue: '$456.00', trend: 8 },
    { name: 'Artisan Bread', sold: 67, revenue: '$335.00', trend: -3 },
    { name: 'Fresh Milk', sold: 125, revenue: '$312.50', trend: 15 },
    { name: 'Chocolate Bar', sold: 89, revenue: '$267.00', trend: 5 },
  ];

  const quickActions = [
    { icon: ShoppingCart, label: 'New Sale', color: 'indigo', action: () => navigate('/pos') },
    { icon: Package, label: 'Add Product', color: 'purple', action: () => navigate('/inventory') },
    { icon: Users, label: 'New Customer', color: 'cyan', action: () => navigate('/customers') },
    { icon: CreditCard, label: 'View Reports', color: 'orange', action: () => navigate('/reports') },
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-full">
      {/* Header with Time */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            <Clock className="w-4 h-4 ml-4" />
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn btn-secondary">
            <Calendar className="w-4 h-4" />
            Today
          </button>
          <button className="btn btn-primary">
            <TrendingUp className="w-4 h-4" />
            View Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.trend}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="stat-value mb-2">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.change} from yesterday</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`
                relative overflow-hidden group p-6 rounded-xl border-2 border-dashed 
                border-gray-300 hover:border-${action.color}-500 hover:bg-${action.color}-50
                transition-all duration-200 hover:scale-105
              `}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 bg-${action.color}-100 rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-gray-900">
                  {action.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Recent Transactions
            </h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.customer}</p>
                    <p className="text-sm text-gray-500">#{transaction.id} • {transaction.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${transaction.amount}</p>
                  <span className="badge badge-success text-xs">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Top Selling Products
            </h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sold} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{product.revenue}</p>
                  <div className={`flex items-center gap-1 text-sm ${product.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(product.trend)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Sales Overview
        </h2>
        
        {/* Simple bar chart visualization */}
        <div className="space-y-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const value = Math.random() * 100 + 20;
            return (
              <div key={day} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 w-12">{day}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${value}%` }}
                  >
                    <span className="text-white text-sm font-semibold">${(value * 28.5).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

