import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, User } from 'lucide-react';
import { usePOSStore } from '../../stores/posStore';

export const Cart: React.FC = () => {
  const {
    cart,
    selectedCustomer,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCheckoutModal,
    openCustomerModal,
    getSubtotal,
    getTaxAmount,
    getTotal,
  } = usePOSStore();

  const subtotal = getSubtotal();
  const tax = getTaxAmount();
  const total = getTotal();

  const handleQuantityChange = (itemId: number, delta: number) => {
    const item = cart.find(i => i.ItemID === itemId);
    if (item) {
      updateQuantity(itemId, item.cartQuantity + delta);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* Cart Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{cart.length} item(s)</p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ShoppingCart className="w-20 h-20 mb-4 opacity-30" />
            <p className="text-lg font-medium">Cart is empty</p>
            <p className="text-sm">Add products to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.ItemID}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Item Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {item.Description}
                    </h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">
                      SKU: {item.ItemLookupCode}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.ItemID)}
                    className="text-red-500 hover:text-red-700 transition-colors ml-2"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Quantity and Price */}
                <div className="flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.ItemID, -1)}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900">
                      {item.cartQuantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.ItemID, 1)}
                      disabled={item.cartQuantity >= item.Quantity}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-xs text-gray-600">
                      ${item.cartPrice.toFixed(2)} × {item.cartQuantity}
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      ${(item.cartPrice * item.cartQuantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        {/* Customer Selection */}
        <div className="mb-4">
          <button
            onClick={openCustomerModal}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {selectedCustomer
                  ? `${selectedCustomer.FirstName} ${selectedCustomer.LastName}`
                  : 'Select Customer (Optional)'}
              </span>
            </div>
            {selectedCustomer && (
              <span className="text-xs text-gray-500">{selectedCustomer.PhoneNumber}</span>
            )}
          </button>
        </div>

        {/* Totals */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Tax (8%):</span>
            <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg pt-2 border-t border-gray-300">
            <span className="font-bold text-gray-900">Total:</span>
            <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={openCheckoutModal}
          disabled={cart.length === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-lg"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};
