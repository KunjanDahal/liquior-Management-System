# 🗄️ RMH POS Database Setup Guide

## Prerequisites
- ✅ SQL Server Express installed (or SQL Server)
- ✅ SQL Server Management Studio (SSMS) - Optional but recommended

---

## Step 1: Start SQL Server Service

### Option A: Using Services Manager (Easiest)
1. Press `Win + R`, type `services.msc` and press Enter
2. Scroll down to find **SQL Server (SQLEXPRESS)**
3. Right-click and select **Start**
4. Set **Startup type** to **Automatic** so it starts with Windows

### Option B: Using Command Line (Admin)
```powershell
# Start SQL Server service
net start MSSQL$SQLEXPRESS

# Or if using default instance
net start MSSQLSERVER
```

### Option C: Using SQL Server Configuration Manager
1. Open **SQL Server Configuration Manager**
2. Go to **SQL Server Services**
3. Right-click **SQL Server (SQLEXPRESS)** → **Start**

---

## Step 2: Verify SQL Server is Running

```powershell
# Check if SQL Server service is running
Get-Service | Where-Object {$_.Name -like "*SQL*" -and $_.Status -eq "Running"}
```

You should see something like:
```
Status   Name               DisplayName
------   ----               -----------
Running  MSSQL$SQLEXPRESS   SQL Server (SQLEXPRESS)
```

---

## Step 3: Restore the Database

### Option A: Using SQL Server Management Studio (SSMS)

1. **Open SSMS** and connect to `localhost\SQLEXPRESS`
2. **Right-click on Databases** → **Restore Database...**
3. **Select Device** as source
4. Click **Add** and browse to:
   ```
   C:\Users\krist\OneDrive\Desktop\rmh-pos-system\database\rmhSample.bck
   ```
5. Set **Database name** to: `rmhsample`
6. Click **OK** to restore

### Option B: Using SQL Script

1. Open `database/restore-database.sql` in SSMS
2. **Verify the file paths** in the script match your SQL Server installation
3. **Execute** the script (F5)

### Option C: Using Command Line

```powershell
cd C:\Users\krist\OneDrive\Desktop\rmh-pos-system\database

# Restore database
sqlcmd -S localhost\SQLEXPRESS -E -i restore-database.sql
```

---

## Step 4: Create Views and Indexes

### Create Performance Views
```powershell
sqlcmd -S localhost\SQLEXPRESS -E -d rmhsample -i create-views.sql
```

### Create Performance Indexes
```powershell
sqlcmd -S localhost\SQLEXPRESS -E -d rmhsample -i create-indexes.sql
```

---

## Step 5: Verify Database Setup

### Using SSMS:
```sql
USE rmhsample;
GO

-- Check table count (should be 121)
SELECT COUNT(*) as TableCount 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';

-- Check if Cashier table exists and has data
SELECT TOP 5 * FROM Cashier;

-- Check if Item table has products
SELECT TOP 5 ItemID, ItemLookupCode, Description, Price FROM Item;

-- Check Transaction table
SELECT TOP 5 * FROM [Transaction];
```

### Using Command Line:
```powershell
# Test connection
sqlcmd -S localhost\SQLEXPRESS -E -d rmhsample -Q "SELECT @@VERSION"

# Query tables
sqlcmd -S localhost\SQLEXPRESS -E -d rmhsample -Q "SELECT COUNT(*) FROM Item"
```

---

## Step 6: Configure Backend Connection

Update your `backend/.env` file:

```env
# Database Configuration
DB_SERVER=localhost\SQLEXPRESS
DB_NAME=rmhsample
DB_USER=sa
DB_PASSWORD=your_sql_server_password

# If using Windows Authentication (no password needed)
DB_SERVER=localhost\SQLEXPRESS
DB_NAME=rmhsample
# Leave DB_USER and DB_PASSWORD empty for Windows Auth
```

---

## Step 7: Test Backend Connection

```powershell
cd backend
npx ts-node src/scripts/test-db-connection.ts
```

You should see:
```
✅ Connected to SQL Server successfully!
📋 Querying Cashier table structure...
👥 Existing Cashiers found
📦 Testing Item table...
✅ Database test completed successfully!
```

---

## Troubleshooting

### SQL Server won't start
1. Check Windows Event Viewer for errors
2. Verify SQL Server is installed: `Get-Service MSSQL*`
3. Try reinstalling SQL Server Express
4. Check if port 1433 is available

### Cannot connect to SQL Server
1. Enable TCP/IP protocol in SQL Server Configuration Manager
2. Restart SQL Server service after enabling TCP/IP
3. Check Windows Firewall settings
4. Verify instance name is correct

### Database restore fails
1. Check file paths in `restore-database.sql`
2. Ensure you have permissions to the DATA folder
3. Close any connections to rmhsample database
4. Try using SSMS GUI restore instead

### Authentication issues
1. If using SQL Authentication, enable mixed mode authentication
2. Create a SQL login with proper permissions
3. For Windows Authentication, run SSMS as Administrator

---

## Quick Start (If Everything is Set Up)

1. **Start SQL Server:** `services.msc` → Start MSSQL$SQLEXPRESS
2. **Start Backend:** `cd backend && npm run dev`
3. **Start Frontend:** `cd frontend && npm run dev:electron`
4. **Login with:** admin / admin123

---

## Database Schema Overview

- **121 Tables** total
- **Key Tables:**
  - `Cashier` - Employee/user authentication
  - `Item` - Products/inventory
  - `Transaction` - Sales transactions
  - `Customer` - Customer management
  - `Supplier` - Vendor management
  
For full schema documentation, see: `backend/src/models/database-schema.md`

---

## Need Help?

- Check SQL Server error logs: `C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\Log\ERRORLOG`
- Verify SQL Server version: `SELECT @@VERSION`
- Test connection: Use SSMS to connect before trying from code

