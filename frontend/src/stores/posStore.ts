import { create } from 'zustand';
import { CartItem, Customer, Item } from '../types/pos.types';

interface POSState {
  // Cart
  cartItems: CartItem[];
  customer: Customer | null;
  
  // Settings
  storeID: number;
  registerID: string;
  cashierID: number;
  
  // Actions
  addToCart: (item: Item, quantity?: number) => void;
  removeFromCart: (itemID: number) => void;
  updateQuantity: (itemID: number, quantity: number) => void;
  updatePrice: (itemID: number, price: number) => void;
  updateComment: (itemID: number, comment: string) => void;
  clearCart: () => void;
  
  setCustomer: (customer: Customer | null) => void;
  
  setStoreID: (storeID: number) => void;
  setRegisterID: (registerID: string) => void;
  setCashierID: (cashierID: number) => void;
  
  // Computed
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartTax: () => number;
  getCartItemCount: () => number;
}

export const usePOSStore = create<POSState>((set, get) => ({
  // Initial state
  cartItems: [],
  customer: null,
  storeID: 1, // Default store
  registerID: 'POS1', // Default register
  cashierID: 1, // Default cashier (should be set on login)
  
  // Actions
  addToCart: (item: Item, quantity = 1) => {
    const { cartItems } = get();
    const existingItemIndex = cartItems.findIndex(
      (ci) => ci.item.ID === item.ID
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if item already in cart
      const newItems = [...cartItems];
      newItems[existingItemIndex].quantity += quantity;
      set({ cartItems: newItems });
    } else {
      // Add new item to cart
      set({
        cartItems: [
          ...cartItems,
          {
            item,
            quantity,
            price: item.Price,
          },
        ],
      });
    }
  },
  
  removeFromCart: (itemID: number) => {
    set({
      cartItems: get().cartItems.filter((ci) => ci.item.ID !== itemID),
    });
  },
  
  updateQuantity: (itemID: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(itemID);
      return;
    }
    
    set({
      cartItems: get().cartItems.map((ci) =>
        ci.item.ID === itemID ? { ...ci, quantity } : ci
      ),
    });
  },
  
  updatePrice: (itemID: number, price: number) => {
    set({
      cartItems: get().cartItems.map((ci) =>
        ci.item.ID === itemID ? { ...ci, price } : ci
      ),
    });
  },
  
  updateComment: (itemID: number, comment: string) => {
    set({
      cartItems: get().cartItems.map((ci) =>
        ci.item.ID === itemID ? { ...ci, comment } : ci
      ),
    });
  },
  
  clearCart: () => {
    set({ cartItems: [], customer: null });
  },
  
  setCustomer: (customer: Customer | null) => {
    set({ customer });
  },
  
  setStoreID: (storeID: number) => {
    set({ storeID });
  },
  
  setRegisterID: (registerID: string) => {
    set({ registerID });
  },
  
  setCashierID: (cashierID: number) => {
    set({ cashierID });
  },
  
  // Computed values
  getCartSubtotal: () => {
    return get().cartItems.reduce(
      (sum, ci) => sum + ci.price * ci.quantity,
      0
    );
  },
  
  getCartTax: () => {
    const { cartItems } = get();
    const taxableAmount = cartItems
      .filter((ci) => ci.item.Taxable)
      .reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
    
    // Default tax rate (in reality, this should come from configuration or API)
    const taxRate = 0.08; // 8%
    return taxableAmount * taxRate;
  },
  
  getCartTotal: () => {
    return get().getCartSubtotal() + get().getCartTax();
  },
  
  getCartItemCount: () => {
    return get().cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  },
}));

