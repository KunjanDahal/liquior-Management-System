import apiClient from './apiClient';
import {
  Item,
  ItemResponse,
  ItemsResponse,
  ItemSearchParams,
  CreateItemRequest,
  UpdateItemRequest,
  InventoryAdjustmentRequest,
  InventoryTransferRequest,
  BulkPriceUpdateRequest,
  StockLevel,
  InventoryValue,
  Category,
  Department,
  Supplier,
} from '../types/inventory.types';

export const inventoryApi = {
  // Item CRUD
  getItems: async (params: ItemSearchParams): Promise<ItemsResponse> => {
    const { data } = await apiClient.get('/inventory/items', { params });
    return data;
  },

  getItemById: async (id: number): Promise<ItemResponse> => {
    const { data } = await apiClient.get(`/inventory/items/${id}`);
    return data;
  },

  createItem: async (request: CreateItemRequest): Promise<Item> => {
    const { data } = await apiClient.post('/inventory/items', request);
    return data;
  },

  updateItem: async (id: number, request: UpdateItemRequest): Promise<Item> => {
    const { data } = await apiClient.put(`/inventory/items/${id}`, request);
    return data;
  },

  deleteItem: async (id: number): Promise<void> => {
    await apiClient.delete(`/inventory/items/${id}`);
  },

  // Inventory operations
  adjustInventory: async (request: InventoryAdjustmentRequest): Promise<void> => {
    await apiClient.post('/inventory/adjust', request);
  },

  transferInventory: async (request: InventoryTransferRequest): Promise<void> => {
    await apiClient.post('/inventory/transfer', request);
  },

  bulkUpdatePrices: async (request: BulkPriceUpdateRequest): Promise<{ message: string }> => {
    const { data } = await apiClient.post('/inventory/bulk-price-update', request);
    return data;
  },

  // Inventory reporting
  getLowStockItems: async (storeID?: number): Promise<StockLevel[]> => {
    const { data } = await apiClient.get('/inventory/low-stock', {
      params: storeID ? { storeID } : {},
    });
    return data;
  },

  getInventoryValue: async (): Promise<InventoryValue> => {
    const { data } = await apiClient.get('/inventory/value');
    return data;
  },

  // Reference data
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/inventory/categories');
    return data;
  },

  getDepartments: async (): Promise<Department[]> => {
    const { data } = await apiClient.get('/inventory/departments');
    return data;
  },

  getSuppliers: async (): Promise<Supplier[]> => {
    const { data } = await apiClient.get('/inventory/suppliers');
    return data;
  },
};

