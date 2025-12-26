import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  FileText,
  Clock,
  Package,
  CreditCard,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
} from 'lucide-react';

type ReportType = 'sales' | 'customers' | 'inventory' | 'financial';
type TimePeriod = 'today' | 'week' | 'month' | 'year' | 'custom';

const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportType>('sales');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');

  const reportTypes = [
    { id: 'sales' as ReportType, label: 'Sales Reports', icon: TrendingUp, color: 'indigo' },
    { id: 'customers' as ReportType, label: 'Customer Analytics', icon: Users, color: 'purple' },
    { id: 'inventory' as ReportType, label: 'Inventory Reports', icon: Package, color: 'orange' },
    { id: 'financial' as ReportType, label: 'Financial Reports', icon: DollarSign, color: 'green' },
  ];

  const timePeriods: { id: TimePeriod; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' },
    { id: 'custom', label: 'Custom' },
  ];

  // Mock data for customer analytics
  const customerStats = [
    { label: 'Total Customers', value: '1,284', change: '+12.5%', up: true, icon: Users },
    { label: 'New This Month', value: '156', change: '+8.2%', up: true, icon: TrendingUp },
    { label: 'Avg Lifetime Value', value: '$842.50', change: '+15.3%', up: true, icon: DollarSign },
    { label: 'Retention Rate', value: '87.3%', change: '+2.1%', up: true, icon: Percent },
  ];

  const topCustomers = [
    { name: 'John Smith', email: 'john.smith@email.com', purchases: 45, spent: 4250.00, lastPurchase: '2 days ago' },
    { name: 'Sarah Johnson', email: 'sarah.j@email.com', purchases: 38, spent: 3890.00, lastPurchase: '5 days ago' },
    { name: 'Mike Davis', email: 'mike.d@email.com', purchases: 32, spent: 3420.00, lastPurchase: '1 week ago' },
    { name: 'Emily Brown', email: 'emily.b@email.com', purchases: 28, spent: 2980.00, lastPurchase: '3 days ago' },
    { name: 'David Wilson', email: 'd.wilson@email.com', purchases: 25, spent: 2750.00, lastPurchase: '4 days ago' },
  ];

  const customerSegments = [
    { segment: 'VIP Customers', count: 48, percentage: 3.7, revenue: 45280, color: 'from-purple-500 to-pink-600' },
    { segment: 'Regular Customers', count: 312, percentage: 24.3, revenue: 125400, color: 'from-blue-500 to-indigo-600' },
    { segment: 'Occasional Buyers', count: 589, percentage: 45.9, revenue: 68900, color: 'from-cyan-500 to-blue-600' },
    { segment: 'New Customers', count: 335, percentage: 26.1, revenue: 28600, color: 'from-green-500 to-emerald-600' },
  ];

  const salesByCategory = [
    { category: 'Beverages', sales: 12500, percentage: 35, trend: 8 },
    { category: 'Food Items', sales: 9800, percentage: 28, trend: -3 },
    { category: 'Snacks', sales: 6400, percentage: 18, trend: 12 },
    { category: 'Dairy Products', sales: 4200, percentage: 12, trend: 5 },
    { category: 'Others', sales: 2500, percentage: 7, trend: -2 },
  ];

  const recentTransactions = [
    { id: 'TXN-1001', customer: 'John Smith', items: 5, amount: 145.50, payment: 'Credit Card', time: '10 min ago' },
    { id: 'TXN-1002', customer: 'Sarah Johnson', items: 3, amount: 89.99, payment: 'Cash', time: '25 min ago' },
    { id: 'TXN-1003', customer: 'Mike Davis', items: 8, amount: 234.75, payment: 'Debit Card', time: '45 min ago' },
    { id: 'TXN-1004', customer: 'Emily Brown', items: 2, amount: 56.20, payment: 'Credit Card', time: '1 hour ago' },
  ];

  const renderSalesReport = () => (
    <div className="space-y-6">
      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Sales', value: '$35,420', change: '+12.5%', up: true, icon: DollarSign, color: 'emerald' },
          { label: 'Transactions', value: '486', change: '+8.2%', up: true, icon: ShoppingCart, color: 'blue' },
          { label: 'Avg Order Value', value: '$72.88', change: '+4.3%', up: true, icon: TrendingUp, color: 'purple' },
          { label: 'Profit Margin', value: '34.2%', change: '+2.1%', up: true, icon: Percent, color: 'orange' },
        ].map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`p-3 bg-${stat.color}-50 rounded-xl mb-3 inline-block`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="stat-value my-2">{stat.value}</p>
            <div className={`flex items-center gap-1 text-sm font-semibold ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
              {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Sales by Category */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-600" />
          Sales by Category
        </h3>
        <div className="space-y-4">
          {salesByCategory.map((item) => (
            <div key={item.category} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-gray-700">{item.category}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-end pr-3"
                      style={{ width: `${item.percentage}%` }}
                    >
                      <span className="text-white text-sm font-semibold">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <p className="font-bold text-gray-900">${item.sales.toLocaleString()}</p>
                  </div>
                  <div className={`w-16 text-right text-sm font-semibold ${item.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.trend > 0 ? '+' : ''}{item.trend}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Recent Transactions
        </h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="font-mono text-sm">{txn.id}</td>
                  <td className="font-medium">{txn.customer}</td>
                  <td>{txn.items} items</td>
                  <td className="font-bold text-green-600">${txn.amount}</td>
                  <td>
                    <span className="badge badge-info">{txn.payment}</span>
                  </td>
                  <td className="text-gray-500">{txn.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCustomerReport = () => (
    <div className="space-y-6">
      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {customerStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="p-3 bg-purple-50 rounded-xl mb-3 inline-block">
              <stat.icon className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="stat-value my-2">{stat.value}</p>
            <div className={`flex items-center gap-1 text-sm font-semibold ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
              {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Customer Segments */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Customer Segments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customerSegments.map((segment) => (
            <div key={segment.segment} className={`p-6 rounded-xl bg-gradient-to-br ${segment.color} text-white`}>
              <h4 className="font-bold text-lg mb-2">{segment.segment}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Customers:</span>
                  <span className="font-bold text-xl">{segment.count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Percentage:</span>
                  <span className="font-semibold">{segment.percentage}%</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/30">
                  <span className="text-sm opacity-90">Total Revenue:</span>
                  <span className="font-bold text-xl">${segment.revenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Customers */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Top Customers
        </h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Purchases</th>
                <th>Total Spent</th>
                <th>Last Purchase</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr key={customer.email}>
                  <td>
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="font-semibold">{customer.name}</td>
                  <td className="text-gray-600">{customer.email}</td>
                  <td>
                    <span className="badge badge-info">{customer.purchases} orders</span>
                  </td>
                  <td className="font-bold text-green-600">${customer.spent.toLocaleString()}</td>
                  <td className="text-gray-500">{customer.lastPurchase}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderInventoryReport = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Inventory Reports</h3>
          <p className="text-gray-600">Detailed inventory analytics coming soon</p>
          <button className="btn btn-primary mt-4">View Inventory Dashboard</button>
        </div>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Financial Reports</h3>
          <p className="text-gray-600">Comprehensive financial analytics coming soon</p>
          <button className="btn btn-primary mt-4">Generate Report</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your business performance</p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn btn-secondary">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="btn btn-primary">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="card card-compact">
        <div className="flex flex-wrap gap-3">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveReport(type.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
                ${activeReport === type.id
                  ? `bg-${type.color}-600 text-white shadow-lg shadow-${type.color}-500/50`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <type.icon className="w-5 h-5" />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="card card-compact">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Time Period:</span>
          <div className="flex gap-2">
            {timePeriods.map((period) => (
              <button
                key={period.id}
                onClick={() => setTimePeriod(period.id)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${timePeriod === period.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Report Content */}
      {activeReport === 'sales' && renderSalesReport()}
      {activeReport === 'customers' && renderCustomerReport()}
      {activeReport === 'inventory' && renderInventoryReport()}
      {activeReport === 'financial' && renderFinancialReport()}
    </div>
  );
};

export default Reports;

