import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Item {
  ItemID: number;
  ItemLookupCode: string;
  Description: string;
  Price: number;
  Cost: number;
  Quantity: number;
  ReorderPoint: number;
  ItemMinimum: number;
  ItemMaximum: number;
  ItemType: number;
  SupplierID: number;
  Taxable: boolean;
  DateCreated: Date;
  LastUpdated: Date;
}

export interface Customer {
  CustomerID: number;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  EmailAddress: string;
  Address: string;
  City: string;
  State: string;
  ZipCode: string;
  AccountNumber: string;
  CreditLimit: number;
  DateCreated: Date;
}

export interface Tender {
  TenderID: number;
  Description: string;
  Code: string;
  TenderType: number;
  OpensCashDrawer: boolean;
  AllowOverTender: boolean;
  AllowRefund: boolean;
  RequireAuthorization: boolean;
  MaxAmount: number | null;
  MinAmount: number | null;
  Active: boolean;
}

export interface TransactionItem {
  itemID: number;
  quantity: number;
  price?: number;
  comment?: string;
}

export interface TransactionTender {
  tenderID: number;
  amount: number;
  authorizationCode?: string;
  cardNumber?: string;
  cardType?: string;
}

export interface CreateTransactionRequest {
  storeID?: number;
  registerID?: string;
  cashierID?: number;
  customerID?: number;
  items: TransactionItem[];
  tenders?: TransactionTender[];
  comment?: string;
}

export interface TransactionResponse {
  success: boolean;
  transactionID: number;
  transactionNumber: number;
  receiptNumber: string;
  total: number;
  subtotal: number;
  tax: number;
  timestamp: Date;
}

// Product APIs
export const searchProducts = async (query?: string, category?: number, limit: number = 50): Promise<Item[]> => {
  const params: any = {};
  if (query) params.q = query;
  if (category) params.category = category;
  if (limit) params.limit = limit;

  const response = await api.get('/pos/items', { params });
  return response.data.data;
};

export const getProductById = async (id: number): Promise<Item> => {
  const response = await api.get(`/pos/items/${id}`);
  return response.data.data;
};

export const getProductByBarcode = async (barcode: string): Promise<Item> => {
  const response = await api.get(`/pos/items/barcode/${barcode}`);
  return response.data.data;
};

// Customer APIs
export const searchCustomers = async (query: string, limit: number = 20): Promise<Customer[]> => {
  const response = await api.get('/pos/customers', { params: { q: query, limit } });
  return response.data.data;
};

export const getCustomer = async (id: number): Promise<Customer> => {
  const response = await api.get(`/pos/customers/${id}`);
  return response.data.data;
};

// Transaction APIs
export const createTransaction = async (transaction: CreateTransactionRequest): Promise<TransactionResponse> => {
  const response = await api.post('/pos/transactions', transaction);
  return response.data;
};

export const getTransaction = async (id: number): Promise<any> => {
  const response = await api.get(`/pos/transactions/${id}`);
  return response.data.data;
};

export const getTenders = async (): Promise<Tender[]> => {
  const response = await api.get('/pos/tenders');
  return response.data.data;
};

// Inventory check
export const checkStock = async (itemId: number): Promise<{ available: boolean; quantity: number }> => {
  const item = await getProductById(itemId);
  return {
    available: item.Quantity > 0,
    quantity: item.Quantity,
  };
};

// Category and Department APIs
export interface Category {
  ID: number;
  Name: string;
  Code: string;
  Inactive: boolean;
}

export interface Department {
  ID: number;
  Name: string;
  Code: string;
  Inactive: boolean;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/pos/categories');
  return response.data.data;
};

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get('/pos/departments');
  return response.data.data;
};

export default {
  searchProducts,
  getProductById,
  getProductByBarcode,
  searchCustomers,
  getCustomer,
  createTransaction,
  getTransaction,
  getTenders,
  checkStock,
  getCategories,
  getDepartments,
};
