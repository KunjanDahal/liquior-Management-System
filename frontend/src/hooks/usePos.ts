import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { posApi } from '../services/posApi';
import {
  CreateTransactionRequest,
  TransactionSearchParams,
} from '../types/pos.types';

// Query keys
export const posKeys = {
  all: ['pos'] as const,
  items: (search?: string, categoryID?: number) =>
    [...posKeys.all, 'items', search, categoryID] as const,
  itemByCode: (code: string) => [...posKeys.all, 'item', code] as const,
  tenders: () => [...posKeys.all, 'tenders'] as const,
  customers: (search: string) => [...posKeys.all, 'customers', search] as const,
  customerByAccount: (accountNumber: string) =>
    [...posKeys.all, 'customer', accountNumber] as const,
  transactions: (params: TransactionSearchParams) =>
    [...posKeys.all, 'transactions', params] as const,
  transactionDetail: (storeID: number, transactionNumber: number) =>
    [...posKeys.all, 'transaction', storeID, transactionNumber] as const,
};

// Items
export const useItems = (search?: string, categoryID?: number) => {
  return useQuery({
    queryKey: posKeys.items(search, categoryID),
    queryFn: () => posApi.getItems(search, categoryID),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useItemByCode = (code: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: posKeys.itemByCode(code),
    queryFn: () => posApi.getItemByCode(code),
    enabled: enabled && code.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

// Tenders
export const useTenders = () => {
  return useQuery({
    queryKey: posKeys.tenders(),
    queryFn: () => posApi.getTenders(),
    staleTime: 30 * 60 * 1000, // 30 minutes - tenders don't change often
  });
};

// Customers
export const useSearchCustomers = (search: string) => {
  return useQuery({
    queryKey: posKeys.customers(search),
    queryFn: () => posApi.searchCustomers(search),
    enabled: search.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCustomerByAccount = (accountNumber: string) => {
  return useQuery({
    queryKey: posKeys.customerByAccount(accountNumber),
    queryFn: () => posApi.getCustomerByAccount(accountNumber),
    enabled: accountNumber.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

// Transactions
export const useTransactions = (params: TransactionSearchParams) => {
  return useQuery({
    queryKey: posKeys.transactions(params),
    queryFn: () => posApi.searchTransactions(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useTransactionDetail = (storeID: number, transactionNumber: number) => {
  return useQuery({
    queryKey: posKeys.transactionDetail(storeID, transactionNumber),
    queryFn: () => posApi.getTransactionDetails(storeID, transactionNumber),
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTransactionRequest) =>
      posApi.createTransaction(request),
    onSuccess: () => {
      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: posKeys.all });
    },
  });
};

