// Inventory Management Types (matching backend)

export interface Item {
  ID: number;
  ItemLookupCode: string;
  Description: string;
  SubDescription1?: string;
  SubDescription2?: string;
  SubDescription3?: string;
  CategoryID?: number;
  DepartmentID?: number;
  SupplierID?: number;
  Price: number;
  Cost?: number;
  Quantity: number;
  ReorderPoint?: number;
  RestockLevel?: number;
  BinLocation?: string;
  ItemNotDiscountable: boolean;
  ItemType: number;
  Active: boolean;
  UnitOfMeasure?: string;
  Taxable: boolean;
  TaxCode?: number;
  Notes?: string;
  LastReceived?: Date;
  LastSold?: Date;
  DateCreated?: Date;
  ExtendedDescription?: string;
}

export interface Category {
  ID: number;
  Name: string;
  Description?: string;
  DepartmentID?: number;
  Active: boolean;
}

export interface Department {
  ID: number;
  Name: string;
  Description?: string;
  Active: boolean;
}

export interface Supplier {
  ID: number;
  SupplierCode: string;
  CompanyName: string;
  ContactName?: string;
  Address?: string;
  City?: string;
  State?: string;
  Zip?: string;
  Country?: string;
  PhoneNumber?: string;
  EmailAddress?: string;
  Website?: string;
  AccountNumber?: string;
  TaxIDNumber?: string;
  Terms?: string;
  Active: boolean;
}

export interface Dimension {
  ID: number;
  Attribute1ID?: number;
  Attribute2ID?: number;
  Attribute3ID?: number;
  ItemID: number;
  Description: string;
  ItemLookupCode?: string;
  Quantity: number;
  Price?: number;
  Cost?: number;
  UPC?: string;
  Active: boolean;
}

export interface Kit {
  ID: number;
  ItemID: number;
  ComponentID: number;
  Quantity: number;
  Price?: number;
  ItemLookupCode?: string;
  Description?: string;
}

export interface Alias {
  ID: number;
  ItemID: number;
  Alias: string;
  AliasType: number;
}

export interface ItemSearchParams {
  search?: string;
  categoryID?: number;
  departmentID?: number;
  supplierID?: number;
  itemType?: number;
  active?: boolean;
  lowStock?: boolean;
  outOfStock?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ItemResponse {
  item: Item;
  category?: Category;
  department?: Department;
  supplier?: Supplier;
  aliases?: Alias[];
  dimensions?: Dimension[];
  kitComponents?: Kit[];
}

export interface ItemsResponse {
  items: Item[];
  total: number;
}

export interface CreateItemRequest {
  itemLookupCode: string;
  description: string;
  subDescription1?: string;
  subDescription2?: string;
  subDescription3?: string;
  categoryID?: number;
  departmentID?: number;
  supplierID?: number;
  price: number;
  cost?: number;
  quantity: number;
  reorderPoint?: number;
  restockLevel?: number;
  binLocation?: string;
  itemNotDiscountable?: boolean;
  itemType?: number;
  unitOfMeasure?: string;
  taxable?: boolean;
  taxCode?: number;
  notes?: string;
  extendedDescription?: string;
}

export interface UpdateItemRequest extends Partial<CreateItemRequest> {
  id: number;
}

export interface InventoryAdjustmentRequest {
  itemID: number;
  storeID: number;
  quantity: number;
  reasonCode?: string;
  comment?: string;
}

export interface InventoryTransferRequest {
  itemID: number;
  fromStoreID: number;
  toStoreID: number;
  quantity: number;
  notes?: string;
}

export interface BulkPriceUpdateRequest {
  itemIDs: number[];
  priceAdjustment: number;
  adjustmentType: 'amount' | 'percentage';
}

export interface StockLevel {
  itemID: number;
  itemLookupCode: string;
  description: string;
  quantity: number;
  reorderPoint?: number;
  restockLevel?: number;
  status: 'ok' | 'low' | 'out';
}

export interface InventoryValue {
  totalItems: number;
  totalQuantity: number;
  totalCost: number;
  totalRetail: number;
  potentialProfit: number;
}

