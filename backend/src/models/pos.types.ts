// POS Transaction Types
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
  ReferenceNumber?: string;
  ExchangeID?: number;
  RecallID?: number;
  RecallType?: number;
  Status?: number;
  TaxExemptionNumber?: string;
  DiscountReason?: string;
  OriginalStoreID?: number;
  OriginalBatchNumber?: number;
  OriginalTransactionNumber?: number;
}

export interface TransactionEntry {
  ID: number;
  TransactionNumber: number;
  StoreID: number;
  BatchNumber: number;
  ItemID: number;
  Price: number;
  PriceSource?: string;
  Quantity: number;
  QuantityDiscountID?: number;
  Taxable: boolean;
  DetailID?: number;
  Comment?: string;
  DiscountReasonCodeID?: number;
  ReturnReasonCodeID?: number;
  SalesRepID?: number;
  DimensionID?: number;
  LineNumber?: number;
  SerialNumber?: string;
  ExtendedPrice: number;
  OriginalPrice?: number;
  Cost?: number;
}

export interface Tender {
  TenderID: number;
  Description: string;
  Code: string;
  TenderType: number;
  OpensCashDrawer: boolean;
  AllowOverTender: boolean;
  AllowRefund: boolean;
  RequireAuthorization: boolean;
  MaxAmount?: number;
  MinAmount?: number;
  Active: boolean;
}

export interface TenderEntry {
  ID: number;
  TransactionNumber: number;
  StoreID: number;
  BatchNumber: number;
  TenderID: number;
  Amount: number;
  AuthorizationCode?: string;
  CardNumber?: string;
  CardType?: string;
  ExpirationDate?: string;
  PaymentID?: number;
  AccountNumber?: string;
  CheckNumber?: string;
  CurrencyID?: number;
  ExchangeRate?: number;
  ForeignAmount?: number;
}

export interface Receipt {
  TransactionNumber: number;
  StoreID: number;
  BatchNumber: number;
  ReceiptNumber: string;
  PrintDate: Date;
  Reprinted: boolean;
  ReprintCount: number;
  ReceiptType: number;
}

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
  BinLocation?: string;
  ItemNotDiscountable: boolean;
  ItemType: number;
  Active: boolean;
  UnitOfMeasure?: string;
  Taxable: boolean;
  TaxCode?: number;
  Notes?: string;
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
  Country?: string;
  PhoneNumber?: string;
  EmailAddress?: string;
  StoreID?: number;
  PriceLevelID?: number;
  TaxExemptNumber?: string;
  AccountBalance: number;
  CreditLimit?: number;
  Active: boolean;
}

export interface Register {
  ID: string;
  Description: string;
  StoreID: number;
  ComputerName?: string;
  Active: boolean;
}

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

export interface Cashier {
  ID: number;
  Name: string;
  Number: string;
  Password?: string;
  Active: boolean;
  CanVoid: boolean;
  CanRefund: boolean;
  CanDiscount: boolean;
  MaxDiscountPercent?: number;
}

export interface Tax {
  ID: number;
  TaxCode: string;
  Description: string;
  Percentage: number;
  TaxType: number;
  Active: boolean;
}

export interface TaxEntry {
  ID: number;
  TransactionNumber: number;
  StoreID: number;
  BatchNumber: number;
  TaxID: number;
  TaxableAmount: number;
  TaxAmount: number;
  TaxPercentage: number;
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
  taxExemptionNumber?: string;
}

export interface TransactionItemRequest {
  itemID: number;
  quantity: number;
  price?: number;
  comment?: string;
  serialNumber?: string;
  discountReasonCodeID?: number;
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
  taxes: TaxEntry[];
  customer?: Customer;
  cashier?: Cashier;
  receipt?: Receipt;
}

