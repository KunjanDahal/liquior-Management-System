import React, { useState } from 'react';
import { Search, Barcode } from 'lucide-react';
import { useItems, useItemByCode } from '../../hooks/usePos';
import { usePOSStore } from '../../stores/posStore';
import { Item } from '../../types/pos.types';

export const ProductSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const addToCart = usePOSStore((state) => state.addToCart);
  
  const { data: items = [], isLoading } = useItems(
    searchTerm.length >= 2 ? searchTerm : undefined
  );
  
  const { data: barcodeItem } = useItemByCode(barcodeInput, barcodeInput.length > 0);
  
  // Add barcode item to cart when found
  React.useEffect(() => {
    if (barcodeItem) {
      addToCart(barcodeItem, 1);
      setBarcodeInput('');
    }
  }, [barcodeItem, addToCart]);
  
  const handleAddToCart = (item: Item) => {
    addToCart(item, 1);
  };
  
  const handleBarcodeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcodeInput.length > 0) {
      // Trigger barcode lookup
      // The useItemByCode hook will automatically fetch when barcodeInput changes
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Search and Barcode Input */}
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Scan or enter barcode..."
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyPress={handleBarcodeKeyPress}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading products...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm.length > 0 ? 'No products found' : 'Enter search term to find products'}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <ProductCard key={item.ID} item={item} onAdd={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ProductCardProps {
  item: Item;
  onAdd: (item: Item) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAdd }) => {
  return (
    <button
      onClick={() => onAdd(item)}
      className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow text-left"
      disabled={!item.Active || item.Quantity <= 0}
    >
      <div className="font-semibold text-sm mb-1 truncate">{item.Description}</div>
      {item.SubDescription1 && (
        <div className="text-xs text-gray-600 mb-2 truncate">{item.SubDescription1}</div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">
          ${item.Price.toFixed(2)}
        </span>
        <span className={`text-xs px-2 py-1 rounded ${
          item.Quantity > 10 
            ? 'bg-green-100 text-green-800' 
            : item.Quantity > 0 
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          Stock: {item.Quantity}
        </span>
      </div>
      {item.ItemLookupCode && (
        <div className="text-xs text-gray-500 mt-2">{item.ItemLookupCode}</div>
      )}
    </button>
  );
};

