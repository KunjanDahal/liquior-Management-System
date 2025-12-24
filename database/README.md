# RMH POS Database

This folder contains the SQL Server database backup and setup scripts.

## Database Structure

- **121 tables** organized into modules:
  - POS & Transactions (15 tables)
  - Inventory & Products (20 tables)
  - Purchase Orders (22 tables)
  - Customers & AR (18 tables)
  - Suppliers (4 tables)
  - Employees & Time (6 tables)
  - Store & Configuration (15 tables)
  - And more...

## Setup Instructions

### 1. Restore Database

**Option A: Using SQL Server Management Studio (SSMS)**
1. Open SSMS and connect to your SQL Server instance
2. Right-click on **Databases** → **Restore Database...**
3. Select **Device** as source
4. Click **Browse** and select `rmhSample.bck`
5. Set database name to `rmhsample`
6. Adjust file paths if necessary
7. Click **OK** to restore

**Option B: Using SQL Script**
1. Open `restore-database.sql` in SSMS
2. Update file paths if your SQL Server installation is different
3. Execute the script

**Option C: Using Command Line**
```bash
sqlcmd -S localhost\SQLEXPRESS -E -i restore-database.sql
```

### 2. Create Views

After restoring the database, create views for easier querying:

```bash
sqlcmd -S localhost\SQLEXPRESS -E -d rmhsample -i create-views.sql
```

Or open `create-views.sql` in SSMS and execute.

**Views Created:**
- `vw_Products` - Complete product information
- `vw_LowStockProducts` - Products below reorder point
- `vw_TransactionSummary` - Transaction summaries
- `vw_TransactionDetails` - Transaction line items
- `vw_CustomerDetails` - Customer with statistics
- `vw_PurchaseOrderSummary` - PO summaries
- `vw_SupplierDetails` - Supplier with statistics
- `vw_DailySales` - Daily sales aggregates
- `vw_TopSellingProducts` - Best selling products

### 3. Create Indexes

Improve query performance with indexes:

```bash
sqlcmd -S localhost\SQLEXPRESS -E -d rmhsample -i create-indexes.sql
```

Or open `create-indexes.sql` in SSMS and execute.

### 4. Verify Setup

```sql
USE rmhsample;
GO

-- Check table count
SELECT COUNT(*) as TableCount 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';
-- Should return 121

-- Check views
SELECT COUNT(*) as ViewCount 
FROM INFORMATION_SCHEMA.VIEWS;
-- Should return 10+

-- Check indexes
SELECT COUNT(*) as IndexCount 
FROM sys.indexes 
WHERE name LIKE 'IDX_%';
-- Should return 20+

-- Sample data check
SELECT COUNT(*) as ItemCount FROM Item;
SELECT COUNT(*) as CustomerCount FROM Customer;
SELECT COUNT(*) as TransactionCount FROM [Transaction];
```

## Connection Details

Update your backend `.env` file with:

```
DB_SERVER=localhost\SQLEXPRESS
DB_NAME=rmhsample
DB_USER=sa
DB_PASSWORD=your_password
```

## Backup Schedule

Recommended backup schedule:
- **Full backup**: Daily at 2 AM
- **Differential backup**: Every 6 hours
- **Transaction log backup**: Every hour

```sql
-- Example backup command
BACKUP DATABASE rmhsample
TO DISK = 'C:\Backups\rmhsample_full.bak'
WITH COMPRESSION, INIT;
```

## Troubleshooting

### Cannot restore database
- Ensure SQL Server service is running
- Check file paths in restore script
- Ensure you have sufficient permissions
- Try restoring with REPLACE option

### Performance Issues
- Run index maintenance weekly
- Update statistics regularly
- Monitor query execution plans
- Consider adding more indexes based on usage

### Connection Issues
- Verify SQL Server is listening on TCP/IP
- Check firewall settings
- Ensure SQL Server authentication is enabled
- Test connection with SSMS first

## Database Maintenance

### Weekly Tasks
```sql
-- Update statistics
EXEC sp_updatestats;

-- Reindex fragmented indexes
ALTER INDEX ALL ON Item REBUILD;
ALTER INDEX ALL ON [Transaction] REBUILD;
```

### Monthly Tasks
```sql
-- Check database integrity
DBCC CHECKDB(rmhsample);

-- Shrink log file if needed
DBCC SHRINKFILE(rmhsample_log, 1024); -- Keep 1GB
```

## Additional Resources

- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/sql-server/)
- [Backup and Restore](https://docs.microsoft.com/en-us/sql/relational-databases/backup-restore/)
- [Index Design Guide](https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide)

