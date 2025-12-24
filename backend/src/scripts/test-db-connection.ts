/**
 * Test database connection and query Cashier table
 */
import { getConnection, closeConnection } from '../config/database';
import { logger } from '../utils/logger';

async function testConnection() {
  try {
    logger.info('🔄 Testing database connection...');
    const pool = await getConnection();
    
    logger.info('✅ Connected to SQL Server successfully!');
    
    // Test query - Get cashier table structure
    logger.info('\n📋 Querying Cashier table structure...');
    const tableInfo = await pool
      .request()
      .query(`
        SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'Cashier'
        ORDER BY ORDINAL_POSITION
      `);
    
    logger.info('\n📊 Cashier Table Columns:');
    tableInfo.recordset.forEach(col => {
      logger.info(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE}${col.CHARACTER_MAXIMUM_LENGTH ? `(${col.CHARACTER_MAXIMUM_LENGTH})` : ''} ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Query existing cashiers
    logger.info('\n👥 Existing Cashiers:');
    const cashiers = await pool
      .request()
      .query(`
        SELECT TOP 5
          ID,
          Number,
          Name,
          SecurityLevel,
          Inactive
        FROM Cashier
        WHERE Inactive = 0 OR Inactive IS NULL
      `);
    
    if (cashiers.recordset.length > 0) {
      logger.info(`  Found ${cashiers.recordset.length} active cashier(s):`);
      cashiers.recordset.forEach(c => {
        logger.info(`    - ${c.Number}: ${c.Name} [ID: ${c.ID}, Security Level: ${c.SecurityLevel}]`);
      });
    } else {
      logger.warn('  ⚠️  No active cashiers found in database');
    }
    
    // Test Item table
    logger.info('\n📦 Testing Item table...');
    const items = await pool
      .request()
      .query(`SELECT TOP 3 ID, ItemLookupCode, Description, Price FROM Item`);
    
    logger.info(`  Found ${items.recordset.length} sample items`);
    items.recordset.forEach(item => {
      logger.info(`    - ${item.ItemLookupCode}: ${item.Description} ($${item.Price})`);
    });
    
    logger.info('\n✅ Database test completed successfully!');
    
  } catch (error: any) {
    logger.error('❌ Database connection test failed:');
    logger.error(error.message);
    
    if (error.code === 'ETIMEOUT') {
      logger.info('\n💡 Troubleshooting tips:');
      logger.info('  1. Ensure SQL Server is running (check Windows Services)');
      logger.info('  2. Verify SQL Server Express is installed');
      logger.info('  3. Check connection string in backend/.env file');
      logger.info('  4. Try: services.msc → SQL Server (SQLEXPRESS) → Start');
    }
  } finally {
    await closeConnection();
  }
}

// Run the test
testConnection()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

