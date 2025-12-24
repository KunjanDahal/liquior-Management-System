import { ConnectionPool } from 'mssql';
import { getConnection } from '../config/database';
import { logger } from '../utils/logger';

export interface Customer {
  ID: number;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  EmailAddress: string;
  Address: string;
  Address2?: string;
  City: string;
  State: string;
  Zip: string;
  AccountNumber: string;
  Company?: string;
  Notes?: string;
  AccountOpened: Date;
}

export interface CreateCustomerRequest {
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  EmailAddress: string;
  Address: string;
  Address2?: string;
  City: string;
  State: string;
  Zip: string;
  Company?: string;
  Notes?: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  ID: number;
}

export class CustomerService {
  private pool: ConnectionPool;

  constructor(pool: ConnectionPool) {
    this.pool = pool;
  }

  static async create(): Promise<CustomerService> {
    const pool = await getConnection();
    return new CustomerService(pool);
  }

  /**
   * Get all customers with optional search
   */
  async getAllCustomers(search?: string, limit: number = 100): Promise<Customer[]> {
    try {
      let query = `
        SELECT TOP ${limit} *
        FROM Customer
        WHERE 1=1
      `;

      if (search) {
        query += ` AND (
          FirstName LIKE '%${search}%'
          OR LastName LIKE '%${search}%'
          OR Company LIKE '%${search}%'
          OR AccountNumber LIKE '%${search}%'
          OR PhoneNumber LIKE '%${search}%'
          OR EmailAddress LIKE '%${search}%'
        )`;
      }

      query += ` ORDER BY LastName, FirstName`;

      const result = await this.pool.request().query(query);
      return result.recordset;
    } catch (error) {
      logger.error('Error getting customers:', error);
      throw error;
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: number): Promise<Customer | null> {
    try {
      const result = await this.pool.request().query(`
        SELECT *
        FROM Customer
        WHERE ID = ${id}
      `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      logger.error(`Error getting customer ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get customer by account number
   */
  async getCustomerByAccountNumber(accountNumber: string): Promise<Customer | null> {
    try {
      const result = await this.pool.request().query(`
        SELECT *
        FROM Customer
        WHERE AccountNumber = '${accountNumber}'
      `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      logger.error(`Error getting customer by account ${accountNumber}:`, error);
      throw error;
    }
  }

  /**
   * Create new customer
   */
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    try {
      // Generate account number (timestamp-based for simplicity)
      const accountNumber = `CUST${Date.now()}`;

      const result = await this.pool.request().query(`
        INSERT INTO Customer (
          FirstName, LastName, PhoneNumber, EmailAddress,
          Address, Address2, City, State, Zip,
          Company, Notes, AccountNumber, AccountOpened
        )
        OUTPUT INSERTED.*
        VALUES (
          '${data.FirstName.replace(/'/g, "''")}',
          '${data.LastName.replace(/'/g, "''")}',
          '${data.PhoneNumber}',
          '${data.EmailAddress}',
          '${data.Address.replace(/'/g, "''")}',
          ${data.Address2 ? `'${data.Address2.replace(/'/g, "''")}'` : 'NULL'},
          '${data.City.replace(/'/g, "''")}',
          '${data.State}',
          '${data.Zip}',
          ${data.Company ? `'${data.Company.replace(/'/g, "''")}'` : 'NULL'},
          ${data.Notes ? `'${data.Notes.replace(/'/g, "''")}'` : 'NULL'},
          '${accountNumber}',
          GETDATE()
        )
      `);

      logger.info(`Customer created: ${accountNumber}`);
      return result.recordset[0];
    } catch (error) {
      logger.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * Update existing customer
   */
  async updateCustomer(data: UpdateCustomerRequest): Promise<Customer> {
    try {
      const updates: string[] = [];

      if (data.FirstName) updates.push(`FirstName = '${data.FirstName.replace(/'/g, "''")}'`);
      if (data.LastName) updates.push(`LastName = '${data.LastName.replace(/'/g, "''")}'`);
      if (data.PhoneNumber) updates.push(`PhoneNumber = '${data.PhoneNumber}'`);
      if (data.EmailAddress) updates.push(`EmailAddress = '${data.EmailAddress}'`);
      if (data.Address) updates.push(`Address = '${data.Address.replace(/'/g, "''")}'`);
      if (data.Address2 !== undefined) updates.push(`Address2 = ${data.Address2 ? `'${data.Address2.replace(/'/g, "''")}'` : 'NULL'}`);
      if (data.City) updates.push(`City = '${data.City.replace(/'/g, "''")}'`);
      if (data.State) updates.push(`State = '${data.State}'`);
      if (data.Zip) updates.push(`Zip = '${data.Zip}'`);
      if (data.Company !== undefined) updates.push(`Company = ${data.Company ? `'${data.Company.replace(/'/g, "''")}'` : 'NULL'}`);
      if (data.Notes !== undefined) updates.push(`Notes = ${data.Notes ? `'${data.Notes.replace(/'/g, "''")}'` : 'NULL'}`);

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      const result = await this.pool.request().query(`
        UPDATE Customer
        SET ${updates.join(', ')}
        OUTPUT INSERTED.*
        WHERE ID = ${data.ID}
      `);

      if (result.recordset.length === 0) {
        throw new Error('Customer not found');
      }

      logger.info(`Customer updated: ${data.ID}`);
      return result.recordset[0];
    } catch (error) {
      logger.error(`Error updating customer ${data.ID}:`, error);
      throw error;
    }
  }

  /**
   * Delete customer (hard delete - Customer table has no Inactive column)
   */
  async deleteCustomer(id: number): Promise<void> {
    try {
      await this.pool.request().query(`
        DELETE FROM Customer
        WHERE ID = ${id}
      `);

      logger.info(`Customer deleted: ${id}`);
    } catch (error) {
      logger.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get customer purchase history
   */
  async getCustomerPurchaseHistory(customerId: number, limit: number = 20): Promise<any[]> {
    try {
      const result = await this.pool.request().query(`
        SELECT TOP ${limit}
          t.TransactionNumber,
          t.Time,
          t.Total,
          t.Subtotal,
          t.TaxTotal,
          c.Number as CashierNumber,
          c.Name as CashierName
        FROM [Transaction] t
        LEFT JOIN Cashier c ON t.CashierID = c.ID
        WHERE t.CustomerID = ${customerId}
        ORDER BY t.Time DESC
      `);

      return result.recordset;
    } catch (error) {
      logger.error(`Error getting purchase history for customer ${customerId}:`, error);
      throw error;
    }
  }
}

