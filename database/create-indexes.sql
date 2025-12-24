-- =============================================
-- Create Performance Indexes for RMH POS System
-- =============================================
-- Run this after restoring database and creating views

USE rmhsample;
GO

PRINT 'Creating performance indexes...';
GO

-- =============================================
-- Item/Product Indexes
-- =============================================

-- Index on ItemLookupCode for barcode scanning
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Item_ItemLookupCode' AND object_id = OBJECT_ID('Item'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_Item_ItemLookupCode
    ON Item(ItemLookupCode)
    INCLUDE (Description, Price, Quantity);
    PRINT 'Created index: IDX_Item_ItemLookupCode';
END
GO

-- Index on Description for product search
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Item_Description' AND object_id = OBJECT_ID('Item'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_Item_Description
    ON Item(Description);
    PRINT 'Created index: IDX_Item_Description';
END
GO

-- Index on Quantity for low stock queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Item_Quantity' AND object_id = OBJECT_ID('Item'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_Item_Quantity
    ON Item(Quantity)
    INCLUDE (ReorderPoint, ItemMinimum);
    PRINT 'Created index: IDX_Item_Quantity';
END
GO

-- =============================================
-- Transaction Indexes
-- =============================================

-- Index on TransactionDate for date-range queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Transaction_TransactionDate' AND object_id = OBJECT_ID('Transaction'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_Transaction_TransactionDate
    ON [Transaction](TransactionDate DESC)
    INCLUDE (Total, CustomerID, CashierID);
    PRINT 'Created index: IDX_Transaction_TransactionDate';
END
GO

-- Index on CustomerID for customer history
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Transaction_CustomerID' AND object_id = OBJECT_ID('Transaction'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_Transaction_CustomerID
    ON [Transaction](CustomerID)
    INCLUDE (TransactionDate, Total);
    PRINT 'Created index: IDX_Transaction_CustomerID';
END
GO

-- Index on BatchNumber for batch queries
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Transaction_BatchNumber' AND object_id = OBJECT_ID('Transaction'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_Transaction_BatchNumber
    ON [Transaction](BatchNumber);
    PRINT 'Created index: IDX_Transaction_BatchNumber';
END
GO

-- =============================================
-- TransactionEntry Indexes
-- =============================================

-- Index on TransactionID for retrieving transaction items
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_TransactionEntry_TransactionID' AND object_id = OBJECT_ID('TransactionEntry'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_TransactionEntry_TransactionID
    ON TransactionEntry(TransactionID)
    INCLUDE (ItemID, Quantity, Price);
    PRINT 'Created index: IDX_TransactionEntry_TransactionID';
END
GO

-- Index on ItemID for product sales analysis
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_TransactionEntry_ItemID' AND object_id = OBJECT_ID('TransactionEntry'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_TransactionEntry_ItemID
    ON TransactionEntry(ItemID)
    INCLUDE (Quantity, Price);
    PRINT 'Created index: IDX_TransactionEntry_ItemID';
END
GO

-- =============================================
-- Customer Indexes
-- =============================================

-- Index on customer name for search
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Customer_Name' AND object_id = OBJECT_ID('Customer'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_Customer_Name
    ON Customer(LastName, FirstName);
    PRINT 'Created index: IDX_Customer_Name';
END
GO

-- Index on phone for lookup
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Customer_PhoneNumber' AND object_id = OBJECT_ID('Customer'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_Customer_PhoneNumber
    ON Customer(PhoneNumber);
    PRINT 'Created index: IDX_Customer_PhoneNumber';
END
GO

-- Index on email for lookup
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Customer_EmailAddress' AND object_id = OBJECT_ID('Customer'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_Customer_EmailAddress
    ON Customer(EmailAddress);
    PRINT 'Created index: IDX_Customer_EmailAddress';
END
GO

-- =============================================
-- Purchase Order Indexes
-- =============================================

-- Index on PurchaseOrderNumber for search
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_PurchaseOrder_Number' AND object_id = OBJECT_ID('PurchaseOrder'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_PurchaseOrder_Number
    ON PurchaseOrder(PurchaseOrderNumber);
    PRINT 'Created index: IDX_PurchaseOrder_Number';
END
GO

-- Index on SupplierID for supplier orders
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_PurchaseOrder_SupplierID' AND object_id = OBJECT_ID('PurchaseOrder'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_PurchaseOrder_SupplierID
    ON PurchaseOrder(SupplierID)
    INCLUDE (OrderDate, Status, Total);
    PRINT 'Created index: IDX_PurchaseOrder_SupplierID';
END
GO

-- Index on Status for filtering
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_PurchaseOrder_Status' AND object_id = OBJECT_ID('PurchaseOrder'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_PurchaseOrder_Status
    ON PurchaseOrder(Status)
    INCLUDE (OrderDate, SupplierID);
    PRINT 'Created index: IDX_PurchaseOrder_Status';
END
GO

-- =============================================
-- Supplier Indexes
-- =============================================

-- Index on supplier name for search
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Supplier_SupplierName' AND object_id = OBJECT_ID('Supplier'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_Supplier_SupplierName
    ON Supplier(SupplierName);
    PRINT 'Created index: IDX_Supplier_SupplierName';
END
GO

-- Index on Active status
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Supplier_Active' AND object_id = OBJECT_ID('Supplier'))
BEGIN
    CREATE NONCLUSTERED INDEX IDX_Supplier_Active
    ON Supplier(Active);
    PRINT 'Created index: IDX_Supplier_Active';
END
GO

PRINT 'All indexes created successfully!';
PRINT 'Run the following to check index usage:';
PRINT 'SELECT * FROM sys.dm_db_index_usage_stats WHERE database_id = DB_ID(''rmhsample'')';
GO

