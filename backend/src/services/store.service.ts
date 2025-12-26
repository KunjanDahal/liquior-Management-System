import { ConnectionPool } from 'mssql';
import { getConnection } from '../config/database';
import { logger } from '../utils/logger';
import {
  Store,
  Register,
  CreateStoreRequest,
  UpdateStoreRequest,
  CreateRegisterRequest,
  UpdateRegisterRequest,
} from '../models/store.types';

export class StoreService {
  private pool: ConnectionPool;

  constructor(pool: ConnectionPool) {
    this.pool = pool;
  }

  static async create(): Promise<StoreService> {
    const pool = await getConnection();
    return new StoreService(pool);
  }

  /**
   * Get all stores
   */
  async getAllStores(activeOnly: boolean = false): Promise<Store[]> {
    try {
      let whereClause = '';
      if (activeOnly) {
        whereClause = 'WHERE ISNULL(Active, 1) = 1';
      }

      const result = await this.pool.request().query(`
        SELECT * FROM Store
        ${whereClause}
        ORDER BY StoreName
      `);

      return result.recordset;
    } catch (error) {
      logger.error('Error getting stores:', error);
      throw error;
    }
  }

  /**
   * Get store by ID
   */
  async getStoreById(id: number): Promise<Store | null> {
    try {
      const result = await this.pool.request().query(`
        SELECT * FROM Store
        WHERE ID = ${id}
      `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      logger.error(`Error getting store ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new store
   */
  async createStore(request: CreateStoreRequest): Promise<Store> {
    try {
      // Get next store ID
      const nextIdResult = await this.pool.request().query(`
        SELECT ISNULL(MAX(ID), 0) + 1 as NextID FROM Store
      `);
      const nextID = nextIdResult.recordset[0].NextID;

      const result = await this.pool.request().query(`
        INSERT INTO Store (
          ID, StoreName, Address, City, State, Zip, PhoneNumber, Active
        )
        OUTPUT INSERTED.*
        VALUES (
          ${nextID},
          '${request.storeName.replace(/'/g, "''")}',
          ${request.address ? `'${request.address.replace(/'/g, "''")}'` : 'NULL'},
          ${request.city ? `'${request.city.replace(/'/g, "''")}'` : 'NULL'},
          ${request.state ? `'${request.state}'` : 'NULL'},
          ${request.zip ? `'${request.zip}'` : 'NULL'},
          ${request.phoneNumber ? `'${request.phoneNumber}'` : 'NULL'},
          ${request.active !== false ? 1 : 0}
        )
      `);

      logger.info(`Store ${nextID} created successfully`);
      return result.recordset[0];
    } catch (error) {
      logger.error('Error creating store:', error);
      throw error;
    }
  }

  /**
   * Update existing store
   */
  async updateStore(request: UpdateStoreRequest): Promise<Store> {
    try {
      const updates: string[] = [];

      if (request.storeName) updates.push(`StoreName = '${request.storeName.replace(/'/g, "''")}'`);
      if (request.address !== undefined) updates.push(`Address = ${request.address ? `'${request.address.replace(/'/g, "''")}'` : 'NULL'}`);
      if (request.city !== undefined) updates.push(`City = ${request.city ? `'${request.city.replace(/'/g, "''")}'` : 'NULL'}`);
      if (request.state !== undefined) updates.push(`State = ${request.state ? `'${request.state}'` : 'NULL'}`);
      if (request.zip !== undefined) updates.push(`Zip = ${request.zip ? `'${request.zip}'` : 'NULL'}`);
      if (request.phoneNumber !== undefined) updates.push(`PhoneNumber = ${request.phoneNumber ? `'${request.phoneNumber}'` : 'NULL'}`);
      if (request.active !== undefined) updates.push(`Active = ${request.active ? 1 : 0}`);

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      const result = await this.pool.request().query(`
        UPDATE Store
        SET ${updates.join(', ')}
        OUTPUT INSERTED.*
        WHERE ID = ${request.id}
      `);

      if (result.recordset.length === 0) {
        throw new Error('Store not found');
      }

      logger.info(`Store ${request.id} updated successfully`);
      return result.recordset[0];
    } catch (error) {
      logger.error(`Error updating store ${request.id}:`, error);
      throw error;
    }
  }

  /**
   * Get all registers for a store
   */
  async getRegistersByStoreId(storeID: number, activeOnly: boolean = false): Promise<Register[]> {
    try {
      let whereClause = `WHERE StoreID = ${storeID}`;
      if (activeOnly) {
        whereClause += ' AND ISNULL(Active, 1) = 1';
      }

      const result = await this.pool.request().query(`
        SELECT * FROM Register
        ${whereClause}
        ORDER BY Description
      `);

      return result.recordset;
    } catch (error) {
      logger.error(`Error getting registers for store ${storeID}:`, error);
      throw error;
    }
  }

  /**
   * Get register by ID
   */
  async getRegisterById(id: string, storeID: number): Promise<Register | null> {
    try {
      const result = await this.pool.request().query(`
        SELECT * FROM Register
        WHERE ID = '${id.replace(/'/g, "''")}' AND StoreID = ${storeID}
      `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      logger.error(`Error getting register ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new register
   */
  async createRegister(request: CreateRegisterRequest): Promise<Register> {
    try {
      const result = await this.pool.request().query(`
        INSERT INTO Register (
          ID, Description, StoreID, ComputerName, Active
        )
        OUTPUT INSERTED.*
        VALUES (
          '${request.id.replace(/'/g, "''")}',
          '${request.description.replace(/'/g, "''")}',
          ${request.storeID},
          ${request.computerName ? `'${request.computerName.replace(/'/g, "''")}'` : 'NULL'},
          ${request.active !== false ? 1 : 0}
        )
      `);

      logger.info(`Register ${request.id} created successfully`);
      return result.recordset[0];
    } catch (error) {
      logger.error('Error creating register:', error);
      throw error;
    }
  }

  /**
   * Update existing register
   */
  async updateRegister(request: UpdateRegisterRequest): Promise<Register> {
    try {
      const updates: string[] = [];

      if (request.description) updates.push(`Description = '${request.description.replace(/'/g, "''")}'`);
      if (request.storeID) updates.push(`StoreID = ${request.storeID}`);
      if (request.computerName !== undefined) updates.push(`ComputerName = ${request.computerName ? `'${request.computerName.replace(/'/g, "''")}'` : 'NULL'}`);
      if (request.active !== undefined) updates.push(`Active = ${request.active ? 1 : 0}`);

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      const result = await this.pool.request().query(`
        UPDATE Register
        SET ${updates.join(', ')}
        OUTPUT INSERTED.*
        WHERE ID = '${request.id.replace(/'/g, "''")}'
      `);

      if (result.recordset.length === 0) {
        throw new Error('Register not found');
      }

      logger.info(`Register ${request.id} updated successfully`);
      return result.recordset[0];
    } catch (error) {
      logger.error(`Error updating register ${request.id}:`, error);
      throw error;
    }
  }

  /**
   * Get all registers (across all stores)
   */
  async getAllRegisters(activeOnly: boolean = false): Promise<Register[]> {
    try {
      let whereClause = '';
      if (activeOnly) {
        whereClause = 'WHERE ISNULL(Active, 1) = 1';
      }

      const result = await this.pool.request().query(`
        SELECT * FROM Register
        ${whereClause}
        ORDER BY StoreID, Description
      `);

      return result.recordset;
    } catch (error) {
      logger.error('Error getting registers:', error);
      throw error;
    }
  }
}



