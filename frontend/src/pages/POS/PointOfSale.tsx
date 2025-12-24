import React, { useEffect } from 'react';
import { Store, User as UserIcon, Clock } from 'lucide-react';
import { ProductSearch } from './ProductSearch';
import { Cart } from './Cart';
import { CustomerSelect } from './CustomerSelect';
import { PaymentModal } from './PaymentModal';
import { usePOSStore } from '../../stores/posStore';
import { useAuth } from '../../contexts/AuthContext';
import { useBarcodeScanner } from '../../hooks/useBarcodeScanner';
import { getProductByBarcode } from '../../services/posApi';
import { NotificationContainer, notify } from '../../components/Notification';

export const PointOfSale: React.FC = () => {
  const { user } = useAuth();
  const { isCustomerModalOpen, isCheckoutModalOpen, closeCustomerModal, closeCheckoutModal, addToCart } = usePOSStore();
  const [currentTime, setCurrentTime] = React.useState(new Date());

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

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Store Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Point of Sale</h1>
                <p className="text-blue-100 text-sm">Main Location - Register POS1</p>
              </div>
            </div>

            {/* Center Info */}
            <div className="flex items-center gap-2 text-blue-100">
              <Clock className="w-5 h-5" />
              <div className="text-right">
                <p className="font-semibold">{formatTime(currentTime)}</p>
                <p className="text-xs">{formatDate(currentTime)}</p>
              </div>
            </div>

            {/* Cashier Info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                <p className="text-blue-100 text-sm">Cashier</p>
              </div>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <UserIcon className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>
      </div>

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
