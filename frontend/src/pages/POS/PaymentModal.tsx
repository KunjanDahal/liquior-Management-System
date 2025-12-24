import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, Check } from 'lucide-react';
import { useTenders, useCreateTransaction } from '../../hooks/usePos';
import { usePOSStore } from '../../stores/posStore';
import { TenderRequest } from '../../types/pos.types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (receiptNumber: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedTenderID, setSelectedTenderID] = useState<number | null>(null);
  const [amountTendered, setAmountTendered] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [authCode, setAuthCode] = useState('');
  
  const { data: tenders = [] } = useTenders();
  const createTransaction = useCreateTransaction();
  
  const {
    cartItems,
    customer,
    storeID,
    registerID,
    cashierID,
    getCartTotal,
    clearCart,
  } = usePOSStore();
  
  const total = getCartTotal();
  const amountPaid = parseFloat(amountTendered) || 0;
  const change = amountPaid - total;
  
  useEffect(() => {
    if (isOpen && tenders.length > 0) {
      // Default to first tender (usually cash)
      setSelectedTenderID(tenders[0].TenderID);
      setAmountTendered(total.toFixed(2));
    }
  }, [isOpen, tenders, total]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTenderID) {
      alert('Please select a payment method');
      return;
    }
    
    if (amountPaid < total) {
      alert('Payment amount is less than total');
      return;
    }
    
    try {
      const tenderRequests: TenderRequest[] = [{
        tenderID: selectedTenderID,
        amount: amountPaid,
        authorizationCode: authCode || undefined,
        cardNumber: cardNumber || undefined,
      }];
      
      const result = await createTransaction.mutateAsync({
        storeID,
        registerID,
        cashierID,
        customerID: customer?.ID,
        items: cartItems.map((ci) => ({
          itemID: ci.item.ID,
          quantity: ci.quantity,
          price: ci.price,
          comment: ci.comment,
          serialNumber: ci.serialNumber,
        })),
        tenders: tenderRequests,
      });
      
      clearCart();
      onSuccess(result.receiptNumber);
    } catch (error: any) {
      alert(`Error processing payment: ${error.message || 'Unknown error'}`);
    }
  };
  
  if (!isOpen) return null;
  
  const selectedTender = tenders.find((t) => t.TenderID === selectedTenderID);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={createTransaction.isPending}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Amount Due */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Amount Due</div>
              <div className="text-4xl font-bold text-blue-600">
                ${total.toFixed(2)}
              </div>
            </div>
          </div>
          
          {/* Tender Selection */}
          <div className="p-6 border-b">
            <label className="block text-sm font-semibold mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {tenders.map((tender) => (
                <button
                  key={tender.TenderID}
                  type="button"
                  onClick={() => setSelectedTenderID(tender.TenderID)}
                  className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-all ${
                    selectedTenderID === tender.TenderID
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {tender.TenderType === 0 && <DollarSign className="w-6 h-6" />}
                  {tender.TenderType === 1 && <CreditCard className="w-6 h-6" />}
                  {tender.TenderType === 2 && <Check className="w-6 h-6" />}
                  <span className="font-semibold">{tender.Description}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Payment Details */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Amount Tendered
              </label>
              <input
                type="number"
                step="0.01"
                value={amountTendered}
                onChange={(e) => setAmountTendered(e.target.value)}
                className="w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            {selectedTender?.TenderType === 1 && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Card Number (Last 4 digits)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="****"
                    maxLength={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Authorization Code
                  </label>
                  <input
                    type="text"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
            
            {/* Change Amount */}
            {change >= 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-900">
                    Change Due:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    ${change.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="p-6 border-t bg-gray-50 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={createTransaction.isPending}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTransaction.isPending || amountPaid < total}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createTransaction.isPending ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

