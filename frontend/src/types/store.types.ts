// Store and Register Management Types (matching backend)

export interface Store {
  ID: number;
  StoreName: string;
  Address?: string;
  City?: string;
  State?: string;
  Zip?: string;
  PhoneNumber?: string;
  Active: boolean;
}

export interface Register {
  ID: string;
  Description: string;
  StoreID: number;
  ComputerName?: string;
  Active: boolean;
}

export interface CreateStoreRequest {
  storeName: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phoneNumber?: string;
  active?: boolean;
}

export interface UpdateStoreRequest extends Partial<CreateStoreRequest> {
  id: number;
}

export interface CreateRegisterRequest {
  id: string;
  description: string;
  storeID: number;
  computerName?: string;
  active?: boolean;
}

export interface UpdateRegisterRequest extends Partial<CreateRegisterRequest> {
  id: string;
  storeID?: number;
}



