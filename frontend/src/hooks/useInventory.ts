import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../services/inventoryApi';
import {
  ItemSearchParams,
  CreateItemRequest,
  UpdateItemRequest,
  InventoryAdjustmentRequest,
  InventoryTransferRequest,
  BulkPriceUpdateRequest,
} from '../types/inventory.types';

// Query keys
export const inventoryKeys = {
  all: ['inventory'] as const,
  items: (params: ItemSearchParams) => [...inventoryKeys.all, 'items', params] as const,
  item: (id: number) => [...inventoryKeys.all, 'item', id] as const,
  lowStock: (storeID?: number) => [...inventoryKeys.all, 'low-stock', storeID] as const,
  value: () => [...inventoryKeys.all, 'value'] as const,
  categories: () => [...inventoryKeys.all, 'categories'] as const,
  departments: () => [...inventoryKeys.all, 'departments'] as const,
  suppliers: () => [...inventoryKeys.all, 'suppliers'] as const,
};

// Items
export const useItems = (params: ItemSearchParams) => {
  return useQuery({
    queryKey: inventoryKeys.items(params),
    queryFn: () => inventoryApi.getItems(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useItem = (id: number) => {
  return useQuery({
    queryKey: inventoryKeys.item(id),
    queryFn: () => inventoryApi.getItemById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLowStockItems = (storeID?: number) => {
  return useQuery({
    queryKey: inventoryKeys.lowStock(storeID),
    queryFn: () => inventoryApi.getLowStockItems(storeID),
    staleTime: 5 * 60 * 1000,
  });
};

export const useInventoryValue = () => {
  return useQuery({
    queryKey: inventoryKeys.value(),
    queryFn: () => inventoryApi.getInventoryValue(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Reference data
export const useCategories = () => {
  return useQuery({
    queryKey: inventoryKeys.categories(),
    queryFn: () => inventoryApi.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useDepartments = () => {
  return useQuery({
    queryKey: inventoryKeys.departments(),
    queryFn: () => inventoryApi.getDepartments(),
    staleTime: 30 * 60 * 1000,
  });
};

export const useSuppliers = () => {
  return useQuery({
    queryKey: inventoryKeys.suppliers(),
    queryFn: () => inventoryApi.getSuppliers(),
    staleTime: 30 * 60 * 1000,
  });
};

// Mutations
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateItemRequest) => inventoryApi.createItem(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateItemRequest }) =>
      inventoryApi.updateItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.item(variables.id) });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => inventoryApi.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
};

export const useAdjustInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: InventoryAdjustmentRequest) =>
      inventoryApi.adjustInventory(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
};

export const useTransferInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: InventoryTransferRequest) =>
      inventoryApi.transferInventory(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
};

export const useBulkUpdatePrices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BulkPriceUpdateRequest) =>
      inventoryApi.bulkUpdatePrices(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
};

