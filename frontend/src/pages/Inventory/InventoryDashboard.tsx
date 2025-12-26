import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  Filter,
  Download,
  Plus,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Box,
  Boxes,
  ShoppingBag,
  Archive,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Percent,
  Activity,
  Layers,
} from 'lucide-react';
import { useInventoryValue, useLowStockItems } from '../../hooks/useInventory';

export const InventoryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: inventoryValue, isLoading: valueLoading, error: valueError } = useInventoryValue();
  const { data: lowStockData, isLoading: lowStockLoading, error: lowStockError } = useLowStockItems();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'low' | 'out'>('all');
  
  // Handle data structure
  const lowStockItems = lowStockData?.lowStock || [];
  const outOfStockItems = lowStockData?.outOfStock || [];

  // Calculate additional metrics
  const totalItems = inventoryValue?.itemCount || 0;
  const totalValue = inventoryValue?.costValue || 0;
  const potentialProfit = inventoryValue?.potentialProfit || 0;
  const totalUnits = inventoryValue?.totalUnits || 0;
  const profitMargin = totalValue > 0 ? ((potentialProfit / totalValue) * 100).toFixed(1) : '0.0';
  const avgItemValue = totalItems > 0 ? (totalValue / totalItems).toFixed(2) : '0.00';

  const stats = [
    {
      name: 'Total Products',
      value: totalItems.toLocaleString(),
      icon: Package,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      trend: '+12',
      trendUp: true,
      subtitle: 'Active SKUs',
    },
    {
      name: 'Total Stock Units',
      value: totalUnits.toLocaleString(),
      icon: Boxes,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+5.2%',
      trendUp: true,
      subtitle: 'In warehouse',
    },
    {
      name: 'Inventory Value',
      value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: '+8.1%',
      trendUp: true,
      subtitle: 'Total cost value',
    },
    {
      name: 'Potential Profit',
      value: `$${potentialProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: `${profitMargin}%`,
      trendUp: true,
      subtitle: 'Profit margin',
    },
  ];

  // Mock data for additional features
  const inventoryHealth = {
    healthy: 156,
    low: lowStockItems.length,
    critical: outOfStockItems.length,
    total: totalItems,
  };

  const stockMovements = [
    { id: 1, product: 'Premium Coffee Beans', type: 'in', quantity: 50, time: '2 hours ago', user: 'John D.' },
    { id: 2, product: 'Organic Tea Set', type: 'out', quantity: 15, time: '4 hours ago', user: 'Sale' },
    { id: 3, product: 'Artisan Bread', type: 'in', quantity: 30, time: '5 hours ago', user: 'Sarah M.' },
    { id: 4, product: 'Fresh Milk', type: 'out', quantity: 25, time: '6 hours ago', user: 'Sale' },
  ];

  const topProductsByValue = [
    { name: 'Premium Coffee Beans', value: 2850, units: 250, status: 'healthy' },
    { name: 'Electronics Bundle', value: 1920, units: 48, status: 'healthy' },
    { name: 'Organic Tea Collection', value: 1450, units: 180, status: 'low' },
    { name: 'Artisan Bakery Items', value: 980, units: 320, status: 'healthy' },
    { name: 'Dairy Products', value: 750, units: 450, status: 'critical' },
  ];

  const categoryBreakdown = [
    { category: 'Beverages', items: 45, value: 12500, percentage: 35 },
    { category: 'Food Items', items: 67, value: 9800, percentage: 28 },
    { category: 'Snacks', items: 38, value: 6400, percentage: 18 },
    { category: 'Dairy', items: 25, value: 4200, percentage: 12 },
    { category: 'Others', items: 29, value: 2400, percentage: 7 },
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-full">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Real-time stock monitoring and analytics
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn btn-secondary">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="btn btn-secondary">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="btn btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/inventory/products')}>
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>
      
      {/* Error Messages */}
      {valueError && (
        <div className="alert alert-danger">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Error loading inventory value</p>
            <p className="text-sm">{(valueError as Error).message}</p>
          </div>
        </div>
      )}
      
      {lowStockError && (
        <div className="alert alert-danger">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Error loading stock alerts</p>
            <p className="text-sm">{(lowStockError as Error).message}</p>
          </div>
        </div>
      )}

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {valueLoading ? (
          <div className="col-span-4 text-center py-12">
            <div className="spinner mb-4"></div>
            <p className="text-gray-600">Loading inventory statistics...</p>
          </div>
        ) : (
          stats.map((stat) => (
            <div key={stat.name} className="stat-card group">
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
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="stat-value mb-2">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inventory Health Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Inventory Health Status
          </h2>
          <div className="flex gap-2">
            {(['all', 'low', 'out'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === filter
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'all' ? 'All Items' : filter === 'low' ? 'Low Stock' : 'Out of Stock'}
              </button>
            ))}
          </div>
        </div>

        {/* Health Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Healthy Stock</p>
                <p className="text-2xl font-bold text-green-700">{inventoryHealth.healthy}</p>
              </div>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(inventoryHealth.healthy / inventoryHealth.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-green-700 mt-2">
              {((inventoryHealth.healthy / inventoryHealth.total) * 100).toFixed(1)}% of total inventory
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-900">Low Stock</p>
                <p className="text-2xl font-bold text-amber-700">{inventoryHealth.low}</p>
              </div>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-2">
              <div 
                className="bg-amber-600 h-2 rounded-full" 
                style={{ width: `${(inventoryHealth.low / inventoryHealth.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-amber-700 mt-2">Requires attention soon</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">Out of Stock</p>
                <p className="text-2xl font-bold text-red-700">{inventoryHealth.critical}</p>
              </div>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{ width: `${(inventoryHealth.critical / inventoryHealth.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-red-700 mt-2">Immediate action required</p>
          </div>
        </div>
      </div>

      {/* Stock Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Stock Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Stock Alerts
            </h3>
            <div className="flex gap-2">
              <span className="badge badge-danger">{outOfStockItems.length} Critical</span>
              <span className="badge badge-warning">{lowStockItems.length} Low</span>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {lowStockLoading ? (
              <div className="text-center py-8">
                <div className="spinner mb-2"></div>
                <p className="text-sm text-gray-600">Loading alerts...</p>
              </div>
            ) : (
              <>
                {/* Out of Stock Items */}
                {outOfStockItems.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Critical - Out of Stock</p>
                    {outOfStockItems.slice(0, 3).map((item: any) => (
                      <div key={item.ItemID} className="p-4 rounded-lg bg-red-50 border border-red-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <XCircle className="w-4 h-4 text-red-600" />
                              <p className="font-semibold text-gray-900">{item.Description}</p>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">SKU: {item.ItemLookupCode}</p>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-red-700 font-semibold">Stock: {item.Quantity} units</span>
                              {item.ReorderPoint && (
                                <span className="text-gray-600">Reorder at: {item.ReorderPoint}</span>
                              )}
                            </div>
                          </div>
                          <button className="btn btn-sm btn-danger">Reorder</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Low Stock Items */}
                {lowStockItems.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Warning - Low Stock</p>
                    {lowStockItems.slice(0, 3).map((item: any) => (
                      <div key={item.ItemID} className="p-4 rounded-lg bg-amber-50 border border-amber-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                              <p className="font-semibold text-gray-900">{item.Description}</p>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">SKU: {item.ItemLookupCode}</p>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-amber-700 font-semibold">Stock: {item.Quantity} units</span>
                              {item.ReorderPoint && (
                                <span className="text-gray-600">Reorder at: {item.ReorderPoint}</span>
                              )}
                            </div>
                          </div>
                          <button className="btn btn-sm btn-secondary">Review</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {outOfStockItems.length === 0 && lowStockItems.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">All stock levels are healthy!</p>
                    <p className="text-sm text-gray-500 mt-1">No alerts at this time</p>
                  </div>
                )}
              </>
            )}
          </div>

          {(outOfStockItems.length > 3 || lowStockItems.length > 3) && (
            <button className="w-full mt-4 btn btn-secondary">
              View All Alerts ({outOfStockItems.length + lowStockItems.length})
            </button>
          )}
        </div>

        {/* Recent Stock Movements */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Recent Stock Movements
            </h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {stockMovements.map((movement) => (
              <div key={movement.id} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      movement.type === 'in' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {movement.type === 'in' ? (
                        <ArrowDownRight className={`w-4 h-4 ${
                          movement.type === 'in' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{movement.product}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className={`font-semibold ${
                          movement.type === 'in' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </span>
                        {' '}units • {movement.user}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{movement.time}</p>
                    </div>
                  </div>
                  <span className={`badge ${
                    movement.type === 'in' ? 'badge-success' : 'badge-info'
                  }`}>
                    {movement.type === 'in' ? 'Stock In' : 'Stock Out'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products and Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Value */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Top Products by Value
          </h3>

          <div className="space-y-4">
            {topProductsByValue.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                    <span className={`badge badge-sm ${
                      product.status === 'healthy' ? 'badge-success' :
                      product.status === 'low' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{product.units} units</span>
                    <span className="font-bold text-green-600">${product.value.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Inventory by Category
          </h3>

          <div className="space-y-4">
            {categoryBreakdown.map((cat, index) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-indigo-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-cyan-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="font-medium text-gray-900">{cat.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${cat.value.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{cat.items} items</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full ${
                      index === 0 ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' :
                      index === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      index === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                      index === 3 ? 'bg-gradient-to-r from-cyan-500 to-cyan-600' :
                      'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">{cat.percentage}% of total inventory value</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Percent className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900">{profitMargin}%</p>
              <p className="text-xs text-green-600 font-semibold mt-1">+2.3% vs last month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Box className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Item Value</p>
              <p className="text-2xl font-bold text-gray-900">${avgItemValue}</p>
              <p className="text-xs text-green-600 font-semibold mt-1">+5.1% vs last month</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Archive className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Turnover</p>
              <p className="text-2xl font-bold text-gray-900">4.2x</p>
              <p className="text-xs text-green-600 font-semibold mt-1">Healthy turnover rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Enhanced */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/inventory/products')}
            className="relative overflow-hidden group p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-indigo-100 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-gray-900">Add Product</span>
            </div>
          </button>
          <button className="relative overflow-hidden group p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-200 hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-green-100 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-gray-900">Adjust Stock</span>
            </div>
          </button>
          <button 
            onClick={() => navigate('/reports')}
            className="relative overflow-hidden group p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-purple-100 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-gray-900">View Reports</span>
            </div>
          </button>
          <button className="relative overflow-hidden group p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-orange-100 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-gray-900">Bulk Update</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

