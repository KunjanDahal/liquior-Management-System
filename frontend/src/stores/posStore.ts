import { create } from 'zustand';
import { Item, Customer, Tender, TransactionTender } from '../services/posApi';
import { Store, Register } from '../types/store.types';

export interface CartItem extends Item {
  cartQuantity: number;
  cartPrice: number;
  lineComment?: string;
}

interface POSState {
  // Cart state
  cart: CartItem[];
  selectedCustomer: Customer | null;
  selectedStore: Store | null;
  selectedRegister: Register | null;
  
  // UI state
  isCheckoutModalOpen: boolean;
  isCustomerModalOpen: boolean;
  isStoreRegisterModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Payment state
  appliedTenders: TransactionTender[];
  
  // Cart actions
  addToCart: (item: Item, quantity?: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  updatePrice: (itemId: number, price: number) => void;
  updateLineComment: (itemId: number, comment: string) => void;
  clearCart: () => void;
  
  // Customer actions
  selectCustomer: (customer: Customer | null) => void;
  
  // Store/Register actions
  selectStoreAndRegister: (store: Store, register: Register) => void;
  
  // Modal actions
  openCheckoutModal: () => void;
  closeCheckoutModal: () => void;
  openCustomerModal: () => void;
  closeCustomerModal: () => void;
  openStoreRegisterModal: () => void;
  closeStoreRegisterModal: () => void;
  
  // Payment actions
  addTender: (tender: TransactionTender) => void;
  clearTenders: () => void;
  
  // Calculated values
  getSubtotal: () => number;
  getTaxableAmount: () => number;
  getTaxAmount: () => number;
  getTotal: () => number;
  getTotalPaid: () => number;
  getRemainingBalance: () => number;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const TAX_RATE = 0.08; // 8% sales tax (from mock data)

export const usePOSStore = create<POSState>((set, get) => ({
  // Initial state
  cart: [],
  selectedCustomer: null,
  selectedStore: null,
  selectedRegister: null,
  isCheckoutModalOpen: false,
  isCustomerModalOpen: false,
  isStoreRegisterModalOpen: false,
  isLoading: false,
  error: null,
  appliedTenders: [],
  
  // Cart actions
  addToCart: (item: Item, quantity = 1) => {
    const cart = get().cart;
    const existingItem = cart.find(i => i.ItemID === item.ItemID);
    
    if (existingItem) {
      set({
        cart: cart.map(i =>
          i.ItemID === item.ItemID
            ? { ...i, cartQuantity: i.cartQuantity + quantity }
            : i
        ),
      });
    } else {
      set({
        cart: [
          ...cart,
          {
            ...item,
            cartQuantity: quantity,
            cartPrice: item.Price,
          },
        ],
      });
    }
  },
  
  removeFromCart: (itemId: number) => {
    set({ cart: get().cart.filter(i => i.ItemID !== itemId) });
  },
  
  updateQuantity: (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    
    set({
      cart: get().cart.map(i =>
        i.ItemID === itemId ? { ...i, cartQuantity: quantity } : i
      ),
    });
  },
  
  updatePrice: (itemId: number, price: number) => {
    set({
      cart: get().cart.map(i =>
        i.ItemID === itemId ? { ...i, cartPrice: price } : i
      ),
    });
  },
  
  updateLineComment: (itemId: number, comment: string) => {
    set({
      cart: get().cart.map(i =>
        i.ItemID === itemId ? { ...i, lineComment: comment } : i
      ),
    });
  },
  
  clearCart: () => {
    set({
      cart: [],
      selectedCustomer: null,
      appliedTenders: [],
      error: null,
    });
  },
  
  // Customer actions
  selectCustomer: (customer: Customer | null) => {
    set({ selectedCustomer: customer });
  },
  
  // Store/Register actions
  selectStoreAndRegister: (store: Store, register: Register) => {
    set({ selectedStore: store, selectedRegister: register });
  },
  
  // Modal actions
  openCheckoutModal: () => {
    if (get().cart.length === 0) {
      set({ error: 'Cart is empty' });
      return;
    }
    set({ isCheckoutModalOpen: true, error: null });
  },
  
  closeCheckoutModal: () => {
    set({ isCheckoutModalOpen: false, appliedTenders: [] });
  },
  
  openCustomerModal: () => {
    set({ isCustomerModalOpen: true });
  },
  
  closeCustomerModal: () => {
    set({ isCustomerModalOpen: false });
  },
  
  openStoreRegisterModal: () => {
    set({ isStoreRegisterModalOpen: true });
  },
  
  closeStoreRegisterModal: () => {
    set({ isStoreRegisterModalOpen: false });
  },
  
  // Payment actions
  addTender: (tender: TransactionTender) => {
    set({ appliedTenders: [...get().appliedTenders, tender] });
  },
  
  clearTenders: () => {
    set({ appliedTenders: [] });
  },
  
  // Calculated values
  getSubtotal: () => {
    return get().cart.reduce((sum, item) => sum + item.cartPrice * item.cartQuantity, 0);
  },
  
  getTaxableAmount: () => {
    return get().cart
      .filter(item => item.Taxable)
      .reduce((sum, item) => sum + item.cartPrice * item.cartQuantity, 0);
  },
  
  getTaxAmount: () => {
    return get().getTaxableAmount() * TAX_RATE;
  },
  
  getTotal: () => {
    return get().getSubtotal() + get().getTaxAmount();
  },
  
  getTotalPaid: () => {
    return get().appliedTenders.reduce((sum, tender) => sum + tender.amount, 0);
  },
  
  getRemainingBalance: () => {
    return get().getTotal() - get().getTotalPaid();
  },
  
  // UI actions
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  
  setError: (error: string | null) => {
    set({ error });
  },
}));
