import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { useItems, useDeleteItem, useCategories, useDepartments } from '../../hooks/useInventory';
import { Item, ItemSearchParams } from '../../types/inventory.types';

export const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useState<ItemSearchParams>({
    page: 1,
    pageSize: 50,
    active: true,
    sortBy: 'Description',
    sortOrder: 'asc',
  });

  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: itemsData, isLoading } = useItems(searchParams);
  const { data: categories = [] } = useCategories();
  const { data: departments = [] } = useDepartments();
  const deleteItem = useDeleteItem();

  const items = itemsData?.items || [];
  const total = itemsData?.total || 0;
  const totalPages = Math.ceil(total / (searchParams.pageSize || 50));

  const handleSearch = () => {
    setSearchParams((prev) => ({
      ...prev,
      search: searchInput.length >= 2 ? searchInput : undefined,
      page: 1,
    }));
  };

  const handleFilterChange = (key: keyof ItemSearchParams, value: any) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleDelete = async (id: number, description: string) => {
    if (confirm(`Are you sure you want to delete "${description}"?`)) {
      try {
        await deleteItem.mutateAsync(id);
        alert('Item deleted successfully');
      } catch (error: any) {
        alert(`Error deleting item: ${error.message}`);
      }
    }
  };

  const getStockStatus = (item: Item) => {
    if (item.Quantity <= 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (item.ReorderPoint && item.Quantity <= item.ReorderPoint) {
      return { label: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' };
    }
    return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-100 border rounded-lg hover:bg-gray-200"
          >
            Search
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg ${
              showFilters ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <select
                value={searchParams.categoryID || ''}
                onChange={(e) =>
                  handleFilterChange('categoryID', e.target.value ? parseInt(e.target.value) : undefined)
                }
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.ID} value={cat.ID}>
                    {cat.Name}
                  </option>
                ))}
              </select>

              <select
                value={searchParams.departmentID || ''}
                onChange={(e) =>
                  handleFilterChange('departmentID', e.target.value ? parseInt(e.target.value) : undefined)
                }
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.ID} value={dept.ID}>
                    {dept.Name}
                  </option>
                ))}
              </select>

              <select
                value={searchParams.itemType?.toString() || ''}
                onChange={(e) =>
                  handleFilterChange('itemType', e.target.value ? parseInt(e.target.value) : undefined)
                }
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Types</option>
                <option value="0">Regular</option>
                <option value="1">Matrix</option>
                <option value="2">Kit</option>
                <option value="3">Service</option>
              </select>

              <select
                value={searchParams.lowStock ? 'low' : searchParams.outOfStock ? 'out' : ''}
                onChange={(e) => {
                  if (e.target.value === 'low') {
                    handleFilterChange('lowStock', true);
                    handleFilterChange('outOfStock', false);
                  } else if (e.target.value === 'out') {
                    handleFilterChange('lowStock', false);
                    handleFilterChange('outOfStock', true);
                  } else {
                    handleFilterChange('lowStock', false);
                    handleFilterChange('outOfStock', false);
                  }
                }}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="">All Stock Levels</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading products...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No products found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Cost
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.ID} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono">{item.ItemLookupCode}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold">{item.Description}</div>
                        {item.SubDescription1 && (
                          <div className="text-xs text-gray-500">{item.SubDescription1}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        ${item.Price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        ${(item.Cost || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold">{item.Quantity}</div>
                        {item.ReorderPoint && (
                          <div className="text-xs text-gray-500">
                            Reorder: {item.ReorderPoint}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.ID, item.Description)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((searchParams.page || 1) - 1) * (searchParams.pageSize || 50) + 1} to{' '}
              {Math.min((searchParams.page || 1) * (searchParams.pageSize || 50), total)} of {total}{' '}
              items
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange((searchParams.page || 1) - 1)}
                disabled={(searchParams.page || 1) === 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {searchParams.page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange((searchParams.page || 1) + 1)}
                disabled={(searchParams.page || 1) === totalPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

