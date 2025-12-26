import React, { useEffect } from 'react';
import { ProductSearch } from './ProductSearch';
import { Cart } from './Cart';
import { CustomerSelect } from './CustomerSelect';
import { PaymentModal } from './PaymentModal';
import { StoreRegisterSelect } from './StoreRegisterSelect';
import { usePOSStore } from '../../stores/posStore';
import { useBarcodeScanner } from '../../hooks/useBarcodeScanner';
import { getProductByBarcode } from '../../services/posApi';
import { NotificationContainer, notify } from '../../components/Notification';

export const PointOfSale: React.FC = () => {
  const { 
    isCustomerModalOpen, 
    isCheckoutModalOpen, 
    isStoreRegisterModalOpen,
    selectedStore,
    selectedRegister,
    closeCustomerModal, 
    closeCheckoutModal, 
    openStoreRegisterModal,
    closeStoreRegisterModal,
    selectStoreAndRegister,
    addToCart 
  } = usePOSStore();

  // Show store/register selection modal on mount if not selected
  useEffect(() => {
    if (!selectedStore || !selectedRegister) {
      openStoreRegisterModal();
    }
  }, [selectedStore, selectedRegister, openStoreRegisterModal]);

  // Barcode Scanner Support
  useBarcodeScanner({
    onScan: async (barcode) => {
      try {
        const product = await getProductByBarcode(barcode);
        if (product && product.Quantity > 0) {
          addToCart(product, 1);
          notify.success(`Added: ${product.Description}`);
        } else if (product && product.Quantity === 0) {
          notify.error('Product is out of stock');
        }
      } catch (error) {
        notify.error(`Product not found: ${barcode}`);
      }
    },
    enabled: !isCustomerModalOpen && !isCheckoutModalOpen, // Disable during modals
  });

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Main Content - Two Column Layout */}
      <div className="flex-1 container mx-auto px-6 py-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Column - Product Search (60% / 2 columns) */}
          <div className="lg:col-span-2 h-full overflow-hidden">
            <ProductSearch />
          </div>

          {/* Right Column - Shopping Cart (40% / 1 column) */}
          <div className="lg:col-span-1 h-full overflow-hidden">
            <Cart />
          </div>
        </div>
      </div>

      {/* Modals */}
      <StoreRegisterSelect 
        isOpen={isStoreRegisterModalOpen} 
        onSelect={selectStoreAndRegister}
        onClose={closeStoreRegisterModal} 
      />
      <CustomerSelect isOpen={isCustomerModalOpen} onClose={closeCustomerModal} />
      <PaymentModal isOpen={isCheckoutModalOpen} onClose={closeCheckoutModal} />

      {/* Notifications */}
      <NotificationContainer />

      {/* Keyboard Shortcuts Helper (hidden but functional) */}
      <KeyboardShortcuts />
    </div>
  );
};

// Keyboard Shortcuts Component
const KeyboardShortcuts: React.FC = () => {
  const { openCheckoutModal, openCustomerModal, clearCart, cart } = usePOSStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // F2 - New Transaction (Clear Cart)
      if (e.key === 'F2') {
        e.preventDefault();
        if (cart.length > 0) {
          if (confirm('Clear cart and start new transaction?')) {
            clearCart();
          }
        }
      }

      // F3 - Customer Search
      if (e.key === 'F3') {
        e.preventDefault();
        openCustomerModal();
      }

      // F8 - Checkout
      if (e.key === 'F8') {
        e.preventDefault();
        if (cart.length > 0) {
          openCheckoutModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [cart.length, openCheckoutModal, openCustomerModal, clearCart]);

  return null;
};
