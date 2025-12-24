import apiClient from './apiClient';
import {
  CreateTransactionRequest,
  TransactionResponse,
  TransactionSearchParams,
  TransactionSearchResponse,
  TransactionDetailResponse,
  Item,
  Tender,
  Customer,
} from '../types/pos.types';

export const posApi = {
  // Transaction endpoints
  createTransaction: async (
    request: CreateTransactionRequest
  ): Promise<TransactionResponse> => {
    const { data } = await apiClient.post('/pos/transactions', request);
    return data;
  },

  searchTransactions: async (
    params: TransactionSearchParams
  ): Promise<TransactionSearchResponse> => {
    const { data } = await apiClient.get('/pos/transactions', { params });
    return data;
  },

  getTransactionDetails: async (
    storeID: number,
    transactionNumber: number
  ): Promise<TransactionDetailResponse> => {
    const { data } = await apiClient.get(
      `/pos/transactions/${storeID}/${transactionNumber}`
    );
    return data;
  },

  // Item endpoints
  getItems: async (search?: string, categoryID?: number): Promise<Item[]> => {
    const { data } = await apiClient.get('/pos/items', {
      params: { search, categoryID },
    });
    return data;
  },

  getItemByCode: async (code: string): Promise<Item> => {
    const { data } = await apiClient.get(`/pos/items/code/${code}`);
    return data;
  },

  // Tender endpoints
  getTenders: async (): Promise<Tender[]> => {
    const { data } = await apiClient.get('/pos/tenders');
    return data;
  },

  // Customer endpoints
  getCustomerByAccount: async (accountNumber: string): Promise<Customer> => {
    const { data } = await apiClient.get(`/pos/customers/account/${accountNumber}`);
    return data;
  },

  searchCustomers: async (search: string): Promise<Customer[]> => {
    const { data } = await apiClient.get('/pos/customers/search', {
      params: { q: search },
    });
    return data;
  },
};

