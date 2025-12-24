/**
 * Shared TypeScript types for RMH POS System
 */

// =============================================
// Product/Item Types
// =============================================
export interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  category: string;
  supplier: string;
  supplierId?: number;
  taxable: boolean;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  createdAt: Date;
  updatedAt?: Date;
}

// =============================================
// Transaction Types
// =============================================
export interface Transaction {
  id: number;
  batchNumber: number;
  date: Date;
  subtotal: number;
  tax: number;
  total: number;
  customerName: string;
  customerId?: number;
  cashierName: string;
  cashierId: number;
  storeId: number;
  registerId: number;
  itemCount: number;
  items?: TransactionItem[];
}

export interface TransactionItem {
  id: number;
  transactionId: number;
  itemId: number;
  itemName: string;
  itemSKU: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxAmount: number;
  discount: number;
}

// =============================================
// Customer Types
// =============================================
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: Date;
  totalTransactions: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt?: Date;
}

// =============================================
// Supplier Types
// =============================================
export interface Supplier {
  id: number;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  active: boolean;
  productCount: number;
  purchaseOrderCount: number;
}

// =============================================
// Purchase Order Types
// =============================================
export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  orderDate: Date;
  expectedDate?: Date;
  supplierName: string;
  supplierId: number;
  total: number;
  status: number;
  statusText: 'Pending' | 'Approved' | 'Received' | 'Cancelled';
  itemCount: number;
}

// =============================================
// Employee Types
// =============================================
export interface Cashier {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phone?: string;
  active: boolean;
  hireDate: Date;
}

// =============================================
// Dashboard/Stats Types
// =============================================
export interface DailySales {
  date: Date;
  transactionCount: number;
  subtotal: number;
  totalTax: number;
  totalSales: number;
  uniqueCustomers: number;
}

export interface TopSellingProduct {
  itemId: number;
  productName: string;
  sku: string;
  timesSold: number;
  totalQuantitySold: number;
  totalRevenue: number;
}

// =============================================
// API Response Types
// =============================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =============================================
// Auth Types
// =============================================
export interface AuthUser {
  userId: number;
  cashierId?: number;
  storeId: number;
  role: string;
  fullName: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

