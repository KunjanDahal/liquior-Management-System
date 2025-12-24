-- =============================================
-- Create Database Views for RMH POS System
-- =============================================
-- Run this after restoring the database

USE rmhsample;
GO

-- =============================================
-- Product/Item Views
-- =============================================

-- View: Complete product information with all related data
IF OBJECT_ID('dbo.vw_Products', 'V') IS NOT NULL
    DROP VIEW dbo.vw_Products;
GO

CREATE VIEW dbo.vw_Products AS
SELECT 
    i.ItemID,
    i.ItemLookupCode as SKU,
    i.Description as Name,
    i.Price,
    i.Cost,
    i.Quantity as Stock,
    COALESCE(i.ReorderPoint, i.ItemMinimum) as MinStock,
    COALESCE(i.ItemMaximum, 100) as MaxStock,
    ic.ClassName as Category,
    s.SupplierName as Supplier,
    s.SupplierID,
    i.ItemType,
    i.Taxable,
    i.DateCreated,
    i.LastUpdated,
    CASE 
        WHEN i.Quantity = 0 THEN 'Out of Stock'
        WHEN i.Quantity <= COALESCE(i.ReorderPoint, i.ItemMinimum) THEN 'Low Stock'
        ELSE 'In Stock'
    END as StockStatus
FROM Item i
LEFT JOIN ItemClass ic ON i.ItemType = ic.ItemClassID
LEFT JOIN Supplier s ON i.SupplierID = s.SupplierID;
GO

-- View: Low stock products
IF OBJECT_ID('dbo.vw_LowStockProducts', 'V') IS NOT NULL
    DROP VIEW dbo.vw_LowStockProducts;
GO

CREATE VIEW dbo.vw_LowStockProducts AS
SELECT 
    ItemID,
    SKU,
    Name,
    Stock,
    MinStock,
    Category,
    Supplier,
    CASE 
        WHEN Stock = 0 THEN 'Critical'
        WHEN Stock < MinStock * 0.5 THEN 'High'
        ELSE 'Medium'
    END as Priority
FROM vw_Products
WHERE Stock <= MinStock;
GO

-- =============================================
-- Transaction/Sales Views
-- =============================================

-- View: Transaction summary with customer and cashier info
IF OBJECT_ID('dbo.vw_TransactionSummary', 'V') IS NOT NULL
    DROP VIEW dbo.vw_TransactionSummary;
GO

CREATE VIEW dbo.vw_TransactionSummary AS
SELECT 
    t.TransactionID,
    t.BatchNumber,
    t.TransactionDate,
    t.Total,
    t.Subtotal,
    t.Tax,
    CONCAT(COALESCE(c.FirstName, ''), ' ', COALESCE(c.LastName, 'Guest')) as CustomerName,
    c.CustomerID,
    CONCAT(COALESCE(ca.FirstName, ''), ' ', COALESCE(ca.LastName, 'Unknown')) as CashierName,
    ca.CashierID,
    t.StoreID,
    t.RegisterID,
    (SELECT COUNT(*) FROM TransactionEntry te WHERE te.TransactionID = t.TransactionID) as ItemCount
FROM [Transaction] t
LEFT JOIN Customer c ON t.CustomerID = c.CustomerID
LEFT JOIN Cashier ca ON t.CashierID = ca.CashierID;
GO

-- View: Transaction details with items
IF OBJECT_ID('dbo.vw_TransactionDetails', 'V') IS NOT NULL
    DROP VIEW dbo.vw_TransactionDetails;
GO

CREATE VIEW dbo.vw_TransactionDetails AS
SELECT 
    te.TransactionEntryID,
    te.TransactionID,
    i.ItemID,
    i.Description as ItemName,
    i.ItemLookupCode as ItemSKU,
    te.Quantity,
    te.Price as UnitPrice,
    te.Price * te.Quantity as TotalPrice,
    te.Tax as TaxAmount,
    te.Discount
FROM TransactionEntry te
INNER JOIN Item i ON te.ItemID = i.ItemID;
GO

-- =============================================
-- Customer Views
-- =============================================

-- View: Customer with full details
IF OBJECT_ID('dbo.vw_CustomerDetails', 'V') IS NOT NULL
    DROP VIEW dbo.vw_CustomerDetails;
GO

CREATE VIEW dbo.vw_CustomerDetails AS
SELECT 
    c.CustomerID,
    c.FirstName,
    c.LastName,
    CONCAT(c.FirstName, ' ', c.LastName) as FullName,
    c.EmailAddress as Email,
    c.PhoneNumber as Phone,
    c.Address,
    c.City,
    c.State,
    c.ZipCode,
    c.DateOfBirth,
    c.DateCreated,
    c.LastUpdated,
    (SELECT COUNT(*) FROM [Transaction] t WHERE t.CustomerID = c.CustomerID) as TotalTransactions,
    (SELECT COALESCE(SUM(Total), 0) FROM [Transaction] t WHERE t.CustomerID = c.CustomerID) as TotalSpent
FROM Customer c;
GO

-- =============================================
-- Purchase Order Views
-- =============================================

-- View: Purchase Order summary
IF OBJECT_ID('dbo.vw_PurchaseOrderSummary', 'V') IS NOT NULL
    DROP VIEW dbo.vw_PurchaseOrderSummary;
GO

CREATE VIEW dbo.vw_PurchaseOrderSummary AS
SELECT 
    po.PurchaseOrderID,
    po.PurchaseOrderNumber,
    po.OrderDate,
    po.ExpectedDate,
    s.SupplierName,
    s.SupplierID,
    po.Total,
    po.Status,
    CASE po.Status
        WHEN 0 THEN 'Pending'
        WHEN 1 THEN 'Approved'
        WHEN 2 THEN 'Received'
        WHEN 3 THEN 'Cancelled'
        ELSE 'Unknown'
    END as StatusText,
    (SELECT COUNT(*) FROM PurchaseOrderEntry poe WHERE poe.PurchaseOrderID = po.PurchaseOrderID) as ItemCount
FROM PurchaseOrder po
INNER JOIN Supplier s ON po.SupplierID = s.SupplierID;
GO

-- =============================================
-- Supplier Views
-- =============================================

-- View: Supplier with statistics
IF OBJECT_ID('dbo.vw_SupplierDetails', 'V') IS NOT NULL
    DROP VIEW dbo.vw_SupplierDetails;
GO

CREATE VIEW dbo.vw_SupplierDetails AS
SELECT 
    s.SupplierID,
    s.SupplierName,
    s.ContactName,
    s.PhoneNumber,
    s.EmailAddress,
    s.Address,
    s.City,
    s.State,
    s.ZipCode,
    s.Active,
    (SELECT COUNT(*) FROM Item i WHERE i.SupplierID = s.SupplierID) as ProductCount,
    (SELECT COUNT(*) FROM PurchaseOrder po WHERE po.SupplierID = s.SupplierID) as PurchaseOrderCount
FROM Supplier s;
GO

-- =============================================
-- Dashboard/Reporting Views
-- =============================================

-- View: Daily sales summary
IF OBJECT_ID('dbo.vw_DailySales', 'V') IS NOT NULL
    DROP VIEW dbo.vw_DailySales;
GO

CREATE VIEW dbo.vw_DailySales AS
SELECT 
    CAST(TransactionDate AS DATE) as SaleDate,
    COUNT(*) as TransactionCount,
    SUM(Subtotal) as Subtotal,
    SUM(Tax) as TotalTax,
    SUM(Total) as TotalSales,
    COUNT(DISTINCT CustomerID) as UniqueCustomers
FROM [Transaction]
GROUP BY CAST(TransactionDate AS DATE);
GO

-- View: Top selling products
IF OBJECT_ID('dbo.vw_TopSellingProducts', 'V') IS NOT NULL
    DROP VIEW dbo.vw_TopSellingProducts;
GO

CREATE VIEW dbo.vw_TopSellingProducts AS
SELECT TOP 100
    i.ItemID,
    i.Description as ProductName,
    i.ItemLookupCode as SKU,
    COUNT(te.TransactionEntryID) as TimesSold,
    SUM(te.Quantity) as TotalQuantitySold,
    SUM(te.Price * te.Quantity) as TotalRevenue
FROM TransactionEntry te
INNER JOIN Item i ON te.ItemID = i.ItemID
GROUP BY i.ItemID, i.Description, i.ItemLookupCode
ORDER BY SUM(te.Quantity) DESC;
GO

PRINT 'All views created successfully!';
GO

