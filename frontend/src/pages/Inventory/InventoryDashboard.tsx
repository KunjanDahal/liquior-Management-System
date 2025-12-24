import React from 'react';
import {
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import { useInventoryValue, useLowStockItems } from '../../hooks/useInventory';

export const InventoryDashboard: React.FC = () => {
  const { data: inventoryValue, isLoading: valueLoading, error: valueError } = useInventoryValue();
  const { data: lowStockData, isLoading: lowStockLoading, error: lowStockError } = useLowStockItems();
  
  // Handle data structure
  const lowStockItems = lowStockData?.lowStock || [];
  const outOfStockItems = lowStockData?.outOfStock || [];

  const stats = [
    {
      name: 'Total Items',
      value: inventoryValue?.itemCount?.toLocaleString() || '0',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Quantity',
      value: inventoryValue?.totalUnits?.toLocaleString() || '0',
      icon: BarChart3,
      color: 'bg-green-500',
    },
    {
      name: 'Inventory Value (Cost)',
      value: `$${inventoryValue?.costValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      name: 'Potential Profit',
      value: `$${inventoryValue?.potentialProfit?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
        <p className="text-gray-600">Monitor your inventory levels and value</p>
      </div>
      
      {/* Error Messages */}
      {valueError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading inventory value</p>
          <p className="text-sm">{(valueError as Error).message}</p>
        </div>
      )}
      
      {lowStockError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading stock alerts</p>
          <p className="text-sm">{(lowStockError as Error).message}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {valueLoading ? (
          <div className="col-span-4 text-center py-8 text-gray-500">
            Loading inventory statistics...
          </div>
        ) : (
          stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.name}</div>
            </div>
          ))
        )}
      </div>

      {/* Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Out of Stock */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Out of Stock</h2>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              {lowStockData?.outOfStockCount || outOfStockItems.length}
            </span>
          </div>
          <div className="divide-y max-h-96 overflow-auto">
            {lowStockLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : outOfStockItems.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No out of stock items
              </div>
            ) : (
              outOfStockItems.map((item: any) => (
                <div key={item.ItemID} className="px-6 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{item.Description}</div>
                      <div className="text-xs text-gray-500">{item.ItemLookupCode}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">
                        {item.Quantity} units
                      </div>
                      {item.ReorderPoint && (
                        <div className="text-xs text-gray-500">
                          Reorder: {item.ReorderPoint}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">Low Stock</h2>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              {lowStockData?.lowStockCount || lowStockItems.length}
            </span>
          </div>
          <div className="divide-y max-h-96 overflow-auto">
            {lowStockLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : lowStockItems.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No low stock items
              </div>
            ) : (
              lowStockItems.map((item: any) => (
                <div key={item.ItemID} className="px-6 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{item.Description}</div>
                      <div className="text-xs text-gray-500">{item.ItemLookupCode}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-yellow-600">
                        {item.Quantity} units
                      </div>
                      {item.ReorderPoint && (
                        <div className="text-xs text-gray-500">
                          Reorder: {item.ReorderPoint}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center">
            <Package className="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <div className="text-sm font-semibold">Add Product</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <div className="text-sm font-semibold">Adjust Stock</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center">
            <BarChart3 className="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <div className="text-sm font-semibold">View Reports</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-gray-600" />
            <div className="text-sm font-semibold">Bulk Price Update</div>
          </button>
        </div>
      </div>
    </div>
  );
};

