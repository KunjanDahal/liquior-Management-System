-- =============================================
-- Restore RMH Database Backup
-- =============================================
-- Run this script in SQL Server Management Studio

USE master;
GO

-- Check if database exists and set to single user mode if it does
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'rmhsample')
BEGIN
    ALTER DATABASE rmhsample SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE rmhsample;
END
GO

-- Restore the database
-- IMPORTANT: Adjust file paths based on your SQL Server installation
RESTORE DATABASE rmhsample
FROM DISK = 'C:\Users\krist\OneDrive\Desktop\rmh-pos-system\database\rmhSample.bck'
WITH
    MOVE 'QSDB_Data' TO 'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\rmhsample.mdf',
    MOVE 'QSDB_Log' TO 'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\rmhsample_log.ldf',
    REPLACE,
    RECOVERY;
GO

-- Verify restoration
USE rmhsample;
GO

SELECT 
    'Database restored successfully!' as Status,
    COUNT(*) as TableCount 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';
GO

-- Show all tables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;
GO

