import React, { useState } from 'react';
import { X, Search, User, Phone, Mail } from 'lucide-react';
import { searchCustomers, Customer } from '../../services/posApi';
import { usePOSStore } from '../../stores/posStore';

interface CustomerSelectProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerSelect: React.FC<CustomerSelectProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { selectCustomer, selectedCustomer } = usePOSStore();

  const handleSearch = async () => {
    if (!query.trim()) {
      setCustomers([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const results = await searchCustomers(query);
      setCustomers(results);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search customers');
      console.error('Error searching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCustomer = (customer: Customer | null) => {
    selectCustomer(customer);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Select Customer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, phone, or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Guest Option */}
          <div
            onClick={() => handleSelectCustomer(null)}
            className={`p-4 border-2 rounded-lg mb-4 cursor-pointer transition-all ${
              selectedCustomer === null
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Guest (Walk-in)</p>
                <p className="text-sm text-gray-600">No customer information</p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8 text-gray-500">
              Searching customers...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && query && customers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No customers found</p>
              <p className="text-sm mt-2">Try a different search term</p>
            </div>
          )}

          {/* Customer List */}
          {!isLoading && customers.length > 0 && (
            <div className="space-y-3">
              {customers.map((customer) => (
                <div
                  key={customer.CustomerID}
                  onClick={() => handleSelectCustomer(customer)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedCustomer?.CustomerID === customer.CustomerID
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">
                        {customer.FirstName} {customer.LastName}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{customer.PhoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{customer.EmailAddress}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          {customer.Address}, {customer.City}, {customer.State} {customer.ZipCode}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Account</p>
                      <p className="font-mono text-sm text-gray-700">{customer.AccountNumber}</p>
                      <p className="text-xs text-gray-500 mt-2">Credit Limit</p>
                      <p className="font-semibold text-green-600">${customer.CreditLimit.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
