import apiClient from './apiClient';
import { Batch, OpenBatchRequest, CloseBatchRequest } from '../types/batch.types';

export const getCurrentBatch = (storeId: number) => 
  apiClient.get<Batch | null>(`/api/batches/current?storeId=${storeId}`);

export const getBatchById = (batchNumber: number, storeId: number) => 
  apiClient.get<Batch>(`/api/batches/${batchNumber}?storeId=${storeId}`);

export const openBatch = (data: OpenBatchRequest) => 
  apiClient.post<Batch>('/api/batches/open', data);

export const closeBatch = (data: CloseBatchRequest) => 
  apiClient.post<Batch>('/api/batches/close', data);

export const getBatchHistory = (storeId: number, limit: number = 50) => 
  apiClient.get<Batch[]>(`/api/batches/history?storeId=${storeId}&limit=${limit}`);

export const getAllOpenBatches = () => 
  apiClient.get<Batch[]>('/api/batches/open-all');

