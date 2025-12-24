# RMH POS Database Schema Documentation

## Core Tables Overview (121 Total Tables)

### 1. Authentication & Users
- **Cashier** - Employee/cashier login credentials and information
  - CashierID (PK)
  - LoginName
  - Password
  - FirstName, LastName
  - Active
  - DateCreated, LastUpdated

### 2. Products & Inventory (20 tables)
- **Item** - Product/merchandise information
  - ItemID (PK)
  - ItemLookupCode (Barcode/SKU)
  - Description (Product Name)
  - Price, Cost
  - Quantity (Stock level)
  - ReorderPoint, ItemMinimum, ItemMaximum
  - ItemType (FK to ItemClass)
  - SupplierID (FK to Supplier)
  - Taxable
  - DateCreated, LastUpdated

- **ItemClass** - Product categories
  - ItemClassID (PK)
  - ClassName
  - ParentClassID

- **Supplier** - Vendor information
  - SupplierID (PK)
  - SupplierName
  - Contact information

### 3. Transactions & Sales (15 tables)
- **Transaction** - Sale transactions
  - TransactionID (PK)
  - BatchNumber
  - TransactionDate
  - Total, Subtotal, Tax
  - CustomerID (FK to Customer)
  - CashierID (FK to Cashier)
  - StoreID (FK to Store)
  - RegisterID (FK to Register)

- **TransactionEntry** - Line items in transaction
  - TransactionEntryID (PK)
  - TransactionID (FK)
  - ItemID (FK to Item)
  - Quantity
  - Price
  - LineTotal

- **TenderEntry** - Payment methods used
  - TenderEntryID (PK)
  - TransactionID (FK)
  - TenderID (FK to Tender)
  - Amount
  - AuthorizationCode

- **TaxEntry** - Tax breakdown
  - TaxEntryID (PK)
  - TransactionID (FK)
  - TaxID (FK to Tax)
  - TaxableAmount
  - TaxAmount

- **Tender** - Payment types (Cash, Credit, etc.)
  - TenderID (PK)
  - TenderName
  - RequireAuthorization

### 4. Customers & AR (18 tables)
- **Customer** - Customer information
  - CustomerID (PK)
  - FirstName, LastName
  - PhoneNumber, EmailAddress
  - Address information
  - AccountNumber
  - CreditLimit
  - DateCreated

### 5. Purchase Orders (22 tables)
- Purchase order management
- PO receiving
- Vendor management

### 6. Employees & Time (6 tables)
- Employee management
- Time tracking
- Scheduling

### 7. Store & Configuration (15 tables)
- **Store** - Store locations
  - StoreID (PK)
  - StoreName
  - Address information

- **Register** - POS registers/terminals
  - RegisterID (PK)
  - RegisterName
  - StoreID (FK)

- **Tax** - Tax rates and rules
  - TaxID (PK)
  - TaxDescription
  - TaxPercentage

### 8. Additional Modules
- Gift cards
- Promotions/Discounts
- Reports
- Audit trails
- System configuration

## Key Relationships

```
Cashier (1) -----> (M) Transaction
Customer (1) -----> (M) Transaction
Store (1) -----> (M) Transaction
Transaction (1) -----> (M) TransactionEntry
Item (1) -----> (M) TransactionEntry
Transaction (1) -----> (M) TenderEntry
Transaction (1) -----> (M) TaxEntry
```

## Views Created

1. **vw_Products** - Complete product info with categories and suppliers
2. **vw_LowStockProducts** - Products below reorder point
3. **vw_TransactionSummary** - Transaction headers with customer/cashier
4. **vw_TransactionDetails** - Transaction line items with product details
5. **vw_CustomerDetails** - Customer info with purchase statistics
6. **vw_DailySales** - Daily sales aggregates
7. **vw_TopSellingProducts** - Best selling products
8. **vw_PurchaseOrderSummary** - PO summaries
9. **vw_SupplierDetails** - Supplier info with statistics

## Indexes for Performance

- ItemLookupCode (barcode scanning)
- Item.Description (product search)
- Item.Quantity (low stock queries)
- Transaction.TransactionDate (date range queries)
- Transaction.CustomerID (customer history)
- And 15+ more performance indexes

