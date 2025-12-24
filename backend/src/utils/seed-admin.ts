/**
 * Seed admin user into Cashier table
 * Run this script once to create default admin credentials
 */
import { getConnection, closeConnection } from '../config/database';
import { logger } from './logger';

async function seedAdmin() {
  try {
    logger.info('Connecting to database...');
    const pool = await getConnection();

    // Check if admin user already exists
    const checkResult = await pool
      .request()
      .query(`SELECT CashierID FROM Cashier WHERE LoginName = 'admin'`);

    if (checkResult.recordset.length > 0) {
      logger.info('Admin user already exists. Skipping seed.');
      return;
    }

    // Insert admin user
    await pool
      .request()
      .query(`
        INSERT INTO Cashier (
          LoginName,
          Password,
          FirstName,
          LastName,
          Active,
          DateCreated,
          LastUpdated
        ) VALUES (
          'admin',
          'admin123',
          'System',
          'Administrator',
          1,
          GETDATE(),
          GETDATE()
        )
      `);

    logger.info('✅ Admin user created successfully!');
    logger.info('   Username: admin');
    logger.info('   Password: admin123');
  } catch (error) {
    logger.error('Error seeding admin user:', error);
    throw error;
  } finally {
    await closeConnection();
  }
}

// Run if called directly
if (require.main === module) {
  seedAdmin()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedAdmin;

