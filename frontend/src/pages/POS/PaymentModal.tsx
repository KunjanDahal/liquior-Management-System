import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { usePOSStore } from '../../stores/posStore';
import { getTenders, createTransaction, Tender } from '../../services/posApi';
import { useAuth } from '../../contexts/AuthContext';
import { notify } from '../../components/Notification';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  
  const {
    cart,
    selectedCustomer,
    appliedTenders,
    addTender,
    clearTenders,
    getTotal,
    getTotalPaid,
    getRemainingBalance,
    clearCart,
  } = usePOSStore();
  
  const { user } = useAuth();

  const total = getTotal();
  const totalPaid = getTotalPaid();
  const remainingBalance = getRemainingBalance();
  const change = totalPaid > total ? totalPaid - total : 0;

  useEffect(() => {
    if (isOpen) {
      loadTenders();
      setSuccess(false);
      setError(null);
      setAmount('');
    }
  }, [isOpen]);

  const loadTenders = async () => {
    try {
      const result = await getTenders();
      setTenders(result);
      if (result.length > 0) {
        setSelectedTender(result[0]); // Default to first tender (Cash)
      }
    } catch (err: any) {
      console.error('Error loading tenders:', err);
      setError('Failed to load payment methods');
    }
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleApplyTender = () => {
    if (!selectedTender || !amount) {
      setError('Please select a payment method and enter an amount');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (totalPaid + amountNum > total && !selectedTender.AllowOverTender) {
      setError('This payment method does not allow over-payment');
      return;
    }

    addTender({
      tenderID: selectedTender.TenderID,
      amount: amountNum,
    });

    setAmount('');
    setError(null);
  };

  const handleCompleteSale = async () => {
    if (remainingBalance > 0.01) {
      setError('Payment incomplete. Please add more payments.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const transactionData = {
        storeID: 1,
        registerID: 'POS1',
        cashierID: user?.cashierID || 1,
        customerID: selectedCustomer?.CustomerID,
        items: cart.map(item => ({
          itemID: item.ItemID,
          quantity: item.cartQuantity,
          price: item.cartPrice,
          comment: item.lineComment,
        })),
        tenders: appliedTenders,
      };

      const result = await createTransaction(transactionData);
      
      setSuccess(true);
      setReceiptNumber(result.receiptNumber);
      notify.success(`Transaction completed! Receipt #${result.receiptNumber}`);
      
      // Clear cart and tenders after 2 seconds
      setTimeout(() => {
        clearCart();
        clearTenders();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete transaction');
      console.error('Error completing sale:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
            <p className="text-sm text-gray-600 mt-1">Complete the transaction</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isProcessing}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success State */}
        {success && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Transaction Complete!</h3>
            <p className="text-gray-600 mb-4">Receipt #{receiptNumber}</p>
            <p className="text-sm text-gray-500">Closing automatically...</p>
          </div>
        )}

        {/* Payment Form */}
        {!success && (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              {/* Transaction Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Paid</p>
                    <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {remainingBalance > 0 ? 'Balance Due' : 'Change'}
                    </p>
                    <p className={`text-2xl font-bold ${remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${Math.abs(remainingBalance).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {tenders.map((tender) => (
                    <button
                      key={tender.TenderID}
                      onClick={() => setSelectedTender(tender)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selectedTender?.TenderID === tender.TenderID
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {tender.Code === 'CASH' ? (
                          <DollarSign className="w-8 h-8 text-green-600" />
                        ) : (
                          <CreditCard className="w-8 h-8 text-blue-600" />
                        )}
                        <span className="text-sm font-semibold text-gray-900">
                          {tender.Description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Amount
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyTender()}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Enter amount"
                  />
                  <button
                    onClick={handleApplyTender}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {/* Quick Amount Buttons (for Cash) */}
                {selectedTender?.Code === 'CASH' && remainingBalance > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => handleQuickAmount(remainingBalance)}
                      className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                    >
                      Exact
                    </button>
                    {[10, 20, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => handleQuickAmount(amt)}
                        className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Applied Payments */}
              {appliedTenders.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Applied Payments
                  </label>
                  <div className="space-y-2">
                    {appliedTenders.map((tender, index) => {
                      const tenderInfo = tenders.find(t => t.TenderID === tender.tenderID);
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <span className="font-medium text-gray-900">
                            {tenderInfo?.Description || 'Unknown'}
                          </span>
                          <span className="font-bold text-green-600">
                            ${tender.amount.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteSale}
                  disabled={remainingBalance > 0.01 || isProcessing || appliedTenders.length === 0}
                  className="py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {isProcessing ? 'Processing...' : 'Complete Sale'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
