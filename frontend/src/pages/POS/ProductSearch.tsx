import React, { useState, useEffect, useCallback } from 'react';
import { Search, Package, AlertCircle } from 'lucide-react';
import { searchProducts, Item, getCategories, Category } from '../../services/posApi';
import { usePOSStore } from '../../stores/posStore';
import { notify } from '../../components/Notification';

export const ProductSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [products, setProducts] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart } = usePOSStore();

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err: any) {
        console.error('Error loading categories:', err);
        notify.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchProducts(query, selectedCategory, 50);
      setProducts(results);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getStockStatus = (quantity: number, reorderPoint: number) => {
    if (quantity === 0) {
      return { text: 'Out of Stock', color: 'bg-red-100 text-red-800 border-red-200' };
    } else if (quantity <= reorderPoint) {
      return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    } else {
      return { text: 'In Stock', color: 'bg-green-100 text-green-800 border-green-200' };
    }
  };

  const handleAddToCart = (product: Item) => {
    if (product.Quantity > 0) {
      addToCart(product, 1);
      notify.success(`Added ${product.Description} to cart`);
    } else {
      notify.error('Product is out of stock');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* Search Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name, SKU, or barcode..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-2 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === undefined
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.ID}
              onClick={() => setSelectedCategory(category.ID)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category.ID
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.Name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading products...</div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Package className="w-16 h-16 mb-4 opacity-50" />
            <p>No products found</p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.Quantity, product.ReorderPoint);
              const isOutOfStock = product.Quantity === 0;

              return (
                <div
                  key={product.ItemID}
                  className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer ${
                    isOutOfStock ? 'opacity-60' : ''
                  }`}
                  onClick={() => !isOutOfStock && handleAddToCart(product)}
                >
                  {/* Product Header */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                        {product.Description}
                      </h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">SKU: {product.ItemLookupCode}</p>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Price:</span>
                      <span className="text-lg font-bold text-blue-600">${product.Price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Stock:</span>
                      <span className="text-sm font-medium text-gray-900">{product.Quantity} units</span>
                    </div>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={isOutOfStock}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      isOutOfStock
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                    }`}
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
