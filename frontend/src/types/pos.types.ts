// POS Transaction Types (matching backend)
export interface Transaction {
  TransactionNumber: number;
  StoreID: number;
  BatchNumber: number;
  Time: Date;
  CustomerID?: number;
  CashierID?: number;
  RegisterID?: string;
  Total: number;
  Subtotal: number;
  TaxTotal: number;
  ShippingCharge?: number;
  Comment?: string;
  Status?: number;
}

export interface TransactionEntry {
  ID: number;
  TransactionNumber: number;
  StoreID: number;
  BatchNumber: number;
  ItemID: number;
  ItemLookupCode?: string;
  ItemDescription?: string;
  Price: number;
  Quantity: number;
  Taxable: boolean;
  Comment?: string;
  SerialNumber?: string;
  ExtendedPrice: number;
  LineNumber?: number;
}

export interface Tender {
  TenderID: number;
  Description: string;
  Code: string;
  TenderType: number;
  OpensCashDrawer: boolean;
  AllowOverTender: boolean;
  AllowRefund: boolean;
  Active: boolean;
}

export interface TenderEntry {
  ID: number;
  TransactionNumber: number;
  TenderID: number;
  TenderDescription?: string;
  Amount: number;
  AuthorizationCode?: string;
  CardNumber?: string;
  CardType?: string;
}

export interface Item {
  ID: number;
  ItemLookupCode: string;
  Description: string;
  SubDescription1?: string;
  SubDescription2?: string;
  CategoryID?: number;
  DepartmentID?: number;
  Price: number;
  Cost?: number;
  Quantity: number;
  ItemNotDiscountable: boolean;
  Taxable: boolean;
  Active: boolean;
}

export interface Customer {
  ID: number;
  AccountNumber: string;
  FirstName: string;
  LastName: string;
  Company?: string;
  Address?: string;
  City?: string;
  State?: string;
  Zip?: string;
  PhoneNumber?: string;
  EmailAddress?: string;
  AccountBalance: number;
  Active: boolean;
}

// Cart Item (frontend state)
export interface CartItem {
  item: Item;
  quantity: number;
  price: number;
  comment?: string;
  serialNumber?: string;
}

// Request/Response DTOs
export interface CreateTransactionRequest {
  storeID: number;
  registerID: string;
  cashierID: number;
  customerID?: number;
  items: TransactionItemRequest[];
  tenders: TenderRequest[];
  comment?: string;
}

export interface TransactionItemRequest {
  itemID: number;
  quantity: number;
  price?: number;
  comment?: string;
  serialNumber?: string;
}

export interface TenderRequest {
  tenderID: number;
  amount: number;
  authorizationCode?: string;
  cardNumber?: string;
  cardType?: string;
  checkNumber?: string;
}

export interface TransactionResponse {
  transactionNumber: number;
  storeID: number;
  batchNumber: number;
  total: number;
  subtotal: number;
  taxTotal: number;
  changeAmount: number;
  receiptNumber: string;
  timestamp: Date;
}

export interface TransactionSearchParams {
  storeID?: number;
  startDate?: Date;
  endDate?: Date;
  customerID?: number;
  cashierID?: number;
  minAmount?: number;
  maxAmount?: number;
  status?: number;
  page?: number;
  pageSize?: number;
}

export interface TransactionDetailResponse {
  transaction: Transaction;
  entries: TransactionEntry[];
  tenders: TenderEntry[];
  customer?: Customer;
  receipt?: any;
}

export interface TransactionSearchResponse {
  transactions: Transaction[];
  total: number;
}

