import React, { useState } from 'react';
import { Search, User, X } from 'lucide-react';
import { useSearchCustomers } from '../../hooks/usePos';
import { usePOSStore } from '../../stores/posStore';
import { Customer } from '../../types/pos.types';

export const CustomerSelect: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { customer, setCustomer } = usePOSStore();
  
  const { data: customers = [] } = useSearchCustomers(searchTerm);
  
  const handleSelectCustomer = (selectedCustomer: Customer) => {
    setCustomer(selectedCustomer);
    setSearchTerm('');
    setIsOpen(false);
  };
  
  const handleRemoveCustomer = () => {
    setCustomer(null);
  };
  
  return (
    <div className="relative">
      {customer ? (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-semibold text-sm text-blue-900">
                {customer.FirstName} {customer.LastName}
              </div>
              <div className="text-xs text-blue-700">
                {customer.Company || customer.AccountNumber}
              </div>
            </div>
          </div>
          <button
            onClick={handleRemoveCustomer}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <User className="w-5 h-5 text-gray-600" />
            <span>Add Customer</span>
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-10">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {searchTerm.length < 2 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Enter at least 2 characters to search
                  </div>
                ) : customers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No customers found
                  </div>
                ) : (
                  <div className="divide-y">
                    {customers.map((cust) => (
                      <button
                        key={cust.ID}
                        onClick={() => handleSelectCustomer(cust)}
                        className="w-full text-left p-3 hover:bg-gray-50"
                      >
                        <div className="font-semibold text-sm">
                          {cust.FirstName} {cust.LastName}
                        </div>
                        {cust.Company && (
                          <div className="text-xs text-gray-600">{cust.Company}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {cust.AccountNumber} • {cust.PhoneNumber}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t bg-gray-50">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

