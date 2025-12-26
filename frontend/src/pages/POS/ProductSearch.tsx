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
    <div className="flex flex-col h-full">
      {/* Compact Search Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search or scan barcode..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400 transition-all duration-200 text-sm"
            autoFocus
          />
        </div>
      </div>

      {/* Compact Category Pills */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
              selectedCategory === undefined
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:scale-95'
            }`}
          >
            All
          </button>
          {categories.slice(0, 8).map((category) => (
            <button
              key={category.ID}
              onClick={() => setSelectedCategory(category.ID)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category.ID
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:scale-95'
              }`}
            >
              {category.Name}
            </button>
          ))}
        </div>
      </div>

      {/* Streamlined Products Grid */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="spinner"></div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Package className="w-16 h-16 mb-3 opacity-30" />
            <p className="text-sm">No products found</p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map((product) => {
              const isOutOfStock = product.Quantity === 0;
              const isLowStock = product.Quantity > 0 && product.Quantity <= product.ReorderPoint;

              return (
                <button
                  key={product.ItemID}
                  onClick={() => !isOutOfStock && handleAddToCart(product)}
                  disabled={isOutOfStock}
                  className={`group relative bg-white border-2 rounded-xl p-3 text-left transition-all duration-200 ${
                    isOutOfStock 
                      ? 'border-gray-200 opacity-50 cursor-not-allowed' 
                      : 'border-gray-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 cursor-pointer active:translate-y-0 active:scale-[0.98]'
                  }`}
                >
                  {/* Stock Badge */}
                  {isOutOfStock && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full z-10">
                      Out
                    </div>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full z-10 group-hover:bg-amber-100 transition-colors">
                      Low
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="mb-3 relative z-0">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors duration-200">
                      {product.Description}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono group-hover:text-gray-600 transition-colors duration-200">{product.ItemLookupCode}</p>
                  </div>

                  {/* Price & Stock */}
                  <div className="space-y-1 relative z-0">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold text-indigo-600 group-hover:text-indigo-700 group-hover:scale-105 inline-block transition-all duration-200">${product.Price.toFixed(2)}</span>
                      <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-200">{product.Quantity} in stock</span>
                    </div>
                  </div>

                  {/* Professional Hover Overlay */}
                  {!isOutOfStock && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:via-indigo-500/3 group-hover:to-indigo-500/5 transition-all duration-200 pointer-events-none rounded-xl"></div>
                  )}

                  {/* Shine Effect on Hover */}
                  {!isOutOfStock && (
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
