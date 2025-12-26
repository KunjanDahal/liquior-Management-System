import React, { useState, useEffect } from 'react';
import { Store, X } from 'lucide-react';
import { getAllStores, getRegistersByStoreId, Store as StoreType, Register } from '../../services/storeApi';
import { notify } from '../../components/Notification';

interface StoreRegisterSelectProps {
  isOpen: boolean;
  onSelect: (store: StoreType, register: Register) => void;
  onClose: () => void;
}

export const StoreRegisterSelect: React.FC<StoreRegisterSelectProps> = ({ isOpen, onSelect, onClose }) => {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [registers, setRegisters] = useState<Register[]>([]);
  const [selectedRegister, setSelectedRegister] = useState<Register | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStores();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedStore) {
      loadRegisters(selectedStore.ID);
    } else {
      setRegisters([]);
      setSelectedRegister(null);
    }
  }, [selectedStore]);

  const loadStores = async () => {
    setIsLoading(true);
    try {
      const response = await getAllStores(true); // Active only
      if (response.success) {
        const stores = Array.isArray(response.data) ? response.data : [];
        setStores(stores);
        if (stores.length === 1) {
          setSelectedStore(stores[0]);
        }
      }
    } catch (error: any) {
      notify.error('Failed to load stores');
      console.error('Error loading stores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRegisters = async (storeId: number) => {
    setIsLoading(true);
    try {
      const response = await getRegistersByStoreId(storeId, true); // Active only
      if (response.success) {
        const registers = Array.isArray(response.data) ? response.data : [];
        setRegisters(registers);
        if (registers.length === 1) {
          setSelectedRegister(registers[0]);
        }
      }
    } catch (error: any) {
      notify.error('Failed to load registers');
      console.error('Error loading registers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedStore && selectedRegister) {
      onSelect(selectedStore, selectedRegister);
      onClose();
    } else {
      notify.error('Please select both a store and register');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Select Store & Register</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Store Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Store
            </label>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading stores...</div>
            ) : stores.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No active stores found</div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {stores.map((store) => (
                  <button
                    key={store.ID}
                    onClick={() => setSelectedStore(store)}
                    className={`
                      p-4 rounded-lg border-2 text-left transition-all
                      ${selectedStore?.ID === store.ID
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="font-semibold text-gray-900">{store.StoreName}</div>
                    {(store.Address || store.City) && (
                      <div className="text-sm text-gray-600 mt-1">
                        {[store.Address, store.City, store.State, store.Zip].filter(Boolean).join(', ')}
                      </div>
                    )}
                    {store.PhoneNumber && (
                      <div className="text-sm text-gray-600">{store.PhoneNumber}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Register Selection */}
          {selectedStore && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Register
              </label>
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading registers...</div>
              ) : registers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No active registers found for this store
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {registers.map((register) => (
                    <button
                      key={register.ID}
                      onClick={() => setSelectedRegister(register)}
                      className={`
                        p-4 rounded-lg border-2 text-left transition-all
                        ${selectedRegister?.ID === register.ID
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="font-semibold text-gray-900">{register.Description}</div>
                      <div className="text-sm text-gray-600 mt-1">ID: {register.ID}</div>
                      {register.ComputerName && (
                        <div className="text-sm text-gray-600">Computer: {register.ComputerName}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedStore || !selectedRegister || isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

