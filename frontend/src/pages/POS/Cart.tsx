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
    <div className="flex flex-col h-full">
      {/* Compact Cart Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">Cart</h2>
            <span className="text-sm text-gray-500">({cart.length})</span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Cart Items - Streamlined */}
      <div className="flex-1 overflow-y-auto p-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ShoppingCart className="w-16 h-16 mb-3 opacity-20" />
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="text-xs text-gray-400">Scan or select products</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cart.map((item) => (
              <div
                key={item.ItemID}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Item Row */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {item.Description}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">${item.cartPrice.toFixed(2)} each</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.ItemID)}
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity and Total */}
                <div className="flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleQuantityChange(item.ItemID, -1)}
                      className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-indigo-100 hover:border-indigo-300 border border-transparent rounded transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <Minus className="w-3 h-3 text-gray-700 hover:text-indigo-700 transition-colors" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-gray-900">
                      {item.cartQuantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.ItemID, 1)}
                      disabled={item.cartQuantity >= item.Quantity}
                      className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-indigo-100 hover:border-indigo-300 border border-transparent rounded transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:scale-100"
                    >
                      <Plus className="w-3 h-3 text-gray-700 hover:text-indigo-700 transition-colors" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-indigo-600">
                      ${(item.cartPrice * item.cartQuantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Streamlined Cart Footer */}
      <div className="border-t-2 border-gray-200 bg-white">
        {/* Customer Selection - Compact */}
        <div className="p-3 border-b border-gray-200">
          <button
            onClick={openCustomerModal}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 border border-transparent rounded-lg transition-all duration-200 hover:shadow-sm text-left group"
          >
            <User className="w-4 h-4 text-gray-500 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
            <span className="text-sm text-gray-700 truncate">
              {selectedCustomer
                ? `${selectedCustomer.FirstName} ${selectedCustomer.LastName}`
                : 'Add Customer'}
            </span>
          </button>
        </div>

        {/* Totals - Compact */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Tax (8%)</span>
            <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t-2 border-gray-200">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button - Prominent */}
        <div className="p-3 pt-0">
          <button
            onClick={openCheckoutModal}
            disabled={cart.length === 0}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-lg"
          >
            {cart.length === 0 ? 'Add Items to Cart' : `Charge $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};
