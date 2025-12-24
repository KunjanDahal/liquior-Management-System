import React, { useState } from 'react';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { ProductSearch } from './ProductSearch';
import { Cart } from './Cart';
import { CustomerSelect } from './CustomerSelect';
import { PaymentModal } from './PaymentModal';
import { usePOSStore } from '../../stores/posStore';

export const PointOfSale: React.FC = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState<string | null>(null);
  
  const { cartItems, clearCart } = usePOSStore();
  
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }
    setIsPaymentModalOpen(true);
  };
  
  const handlePaymentSuccess = (receipt: string) => {
    setReceiptNumber(receipt);
    setIsPaymentModalOpen(false);
    
    // Show success message
    setTimeout(() => {
      setReceiptNumber(null);
    }, 5000);
  };
  
  const handleNewTransaction = () => {
    clearCart();
    setReceiptNumber(null);
  };
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Store: <span className="font-semibold">Store 1</span> | 
              Register: <span className="font-semibold">POS1</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Message */}
      {receiptNumber && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <div className="font-semibold text-green-900">
                  Transaction Completed Successfully!
                </div>
                <div className="text-sm text-green-700">
                  Receipt Number: {receiptNumber}
                </div>
              </div>
            </div>
            <button
              onClick={handleNewTransaction}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              New Transaction
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Product Search */}
        <div className="flex-1 bg-white border-r">
          <ProductSearch />
        </div>
        
        {/* Right: Cart & Checkout */}
        <div className="w-[400px] flex flex-col bg-white">
          {/* Customer Selection */}
          <div className="p-4 border-b">
            <CustomerSelect />
          </div>
          
          {/* Cart */}
          <div className="flex-1 overflow-hidden">
            <Cart />
          </div>
          
          {/* Checkout Actions */}
          <div className="p-4 border-t space-y-3">
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>Checkout</span>
            </button>
            
            <button
              onClick={clearCart}
              disabled={cartItems.length === 0}
              className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

