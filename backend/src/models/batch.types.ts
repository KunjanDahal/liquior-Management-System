// Batch Management Types

export interface Batch {
  BatchNumber: number;
  StoreID: number;
  OpenTime: Date;
  CloseTime?: Date;
  OpenEmployeeID?: number;
  CloseEmployeeID?: number;
  Status: number; // 0=Open, 1=Closed, 2=Void
}

export interface OpenBatchRequest {
  storeID: number;
  employeeID: number;
}

export interface CloseBatchRequest {
  batchNumber: number;
  storeID: number;
  employeeID: number;
}



