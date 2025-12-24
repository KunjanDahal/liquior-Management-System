import React from 'react';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { usePOSStore } from '../../stores/posStore';

export const Cart: React.FC = () => {
  const {
    cartItems,
    customer,
    updateQuantity,
    removeFromCart,
    getCartSubtotal,
    getCartTax,
    getCartTotal,
    getCartItemCount,
  } = usePOSStore();
  
  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const total = getCartTotal();
  const itemCount = getCartItemCount();
  
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <ShoppingCart className="w-16 h-16 mb-4" />
        <p className="text-lg">Cart is empty</p>
        <p className="text-sm">Scan or search for products to add</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Customer Info */}
      {customer && (
        <div className="p-4 bg-blue-50 border-b">
          <div className="text-sm font-semibold text-blue-900">
            {customer.FirstName} {customer.LastName}
          </div>
          {customer.Company && (
            <div className="text-xs text-blue-700">{customer.Company}</div>
          )}
          <div className="text-xs text-blue-600">Account: {customer.AccountNumber}</div>
        </div>
      )}
      
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y">
          {cartItems.map((cartItem) => (
            <div key={cartItem.item.ID} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {cartItem.item.Description}
                  </div>
                  {cartItem.item.ItemLookupCode && (
                    <div className="text-xs text-gray-500">
                      {cartItem.item.ItemLookupCode}
                    </div>
                  )}
                  {cartItem.comment && (
                    <div className="text-xs text-blue-600 mt-1 italic">
                      Note: {cartItem.comment}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(cartItem.item.ID)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      updateQuantity(cartItem.item.ID, cartItem.quantity - 1)
                    }
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(cartItem.item.ID, cartItem.quantity + 1)
                    }
                    className="p-1 border rounded hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    ${cartItem.price.toFixed(2)} each
                  </div>
                  <div className="font-bold text-lg">
                    ${(cartItem.price * cartItem.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Totals */}
      <div className="border-t bg-gray-50 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items:</span>
          <span className="font-semibold">{itemCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (8%):</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total:</span>
          <span className="text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

