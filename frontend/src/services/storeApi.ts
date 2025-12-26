import apiClient from './apiClient';
import { Store, Register, CreateStoreRequest, UpdateStoreRequest, CreateRegisterRequest, UpdateRegisterRequest } from '../types/store.types';

export const getAllStores = (activeOnly: boolean = false) => 
  apiClient.get<Store[]>(`/api/stores?activeOnly=${activeOnly}`);

export const getStoreById = (id: number) => 
  apiClient.get<Store>(`/api/stores/${id}`);

export const createStore = (data: CreateStoreRequest) => 
  apiClient.post<Store>('/api/stores', data);

export const updateStore = (id: number, data: UpdateStoreRequest) => 
  apiClient.put<Store>(`/api/stores/${id}`, data);

export const getRegistersByStoreId = (storeId: number, activeOnly: boolean = false) => 
  apiClient.get<Register[]>(`/api/stores/${storeId}/registers?activeOnly=${activeOnly}`);

export const getAllRegisters = (activeOnly: boolean = false) => 
  apiClient.get<Register[]>(`/api/registers?activeOnly=${activeOnly}`);

export const getRegisterById = (id: string, storeId: number) => 
  apiClient.get<Register>(`/api/registers/${id}?storeId=${storeId}`);

export const createRegister = (data: CreateRegisterRequest) => 
  apiClient.post<Register>('/api/registers', data);

export const updateRegister = (id: string, data: UpdateRegisterRequest) => 
  apiClient.put<Register>(`/api/registers/${id}`, data);

