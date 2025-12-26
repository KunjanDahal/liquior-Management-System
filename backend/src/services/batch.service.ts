import { ConnectionPool } from 'mssql';
import { getConnection } from '../config/database';
import { logger } from '../utils/logger';
import {
  Batch,
  OpenBatchRequest,
  CloseBatchRequest,
} from '../models/batch.types';

export class BatchService {
  private pool: ConnectionPool;

  constructor(pool: ConnectionPool) {
    this.pool = pool;
  }

  static async create(): Promise<BatchService> {
    const pool = await getConnection();
    return new BatchService(pool);
  }

  /**
   * Get current open batch for a store
   */
  async getCurrentBatch(storeID: number): Promise<Batch | null> {
    try {
      const result = await this.pool.request().query(`
        SELECT TOP 1 *
        FROM Batch
        WHERE StoreID = ${storeID}
          AND Status = 0
        ORDER BY OpenTime DESC
      `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      logger.error(`Error getting current batch for store ${storeID}:`, error);
      throw error;
    }
  }

  /**
   * Get batch by batch number and store ID
   */
  async getBatchById(batchNumber: number, storeID: number): Promise<Batch | null> {
    try {
      const result = await this.pool.request().query(`
        SELECT *
        FROM Batch
        WHERE BatchNumber = ${batchNumber}
          AND StoreID = ${storeID}
      `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      logger.error(`Error getting batch ${batchNumber} for store ${storeID}:`, error);
      throw error;
    }
  }

  /**
   * Open a new batch
   */
  async openBatch(request: OpenBatchRequest): Promise<Batch> {
    try {
      // Check if there's already an open batch
      const currentBatch = await this.getCurrentBatch(request.storeID);
      if (currentBatch) {
        throw new Error('A batch is already open for this store. Please close it before opening a new one.');
      }

      // Get next batch number for this store
      const nextBatchResult = await this.pool.request().query(`
        SELECT ISNULL(MAX(BatchNumber), 0) + 1 as NextBatchNumber
        FROM Batch
        WHERE StoreID = ${request.storeID}
      `);
      const nextBatchNumber = nextBatchResult.recordset[0].NextBatchNumber;

      const result = await this.pool.request().query(`
        INSERT INTO Batch (
          BatchNumber, StoreID, OpenTime, OpenEmployeeID, Status
        )
        OUTPUT INSERTED.*
        VALUES (
          ${nextBatchNumber},
          ${request.storeID},
          GETDATE(),
          ${request.employeeID},
          0
        )
      `);

      logger.info(`Batch ${nextBatchNumber} opened for store ${request.storeID}`);
      return result.recordset[0];
    } catch (error) {
      logger.error('Error opening batch:', error);
      throw error;
    }
  }

  /**
   * Close a batch
   */
  async closeBatch(request: CloseBatchRequest): Promise<Batch> {
    try {
      const batch = await this.getBatchById(request.batchNumber, request.storeID);
      if (!batch) {
        throw new Error('Batch not found');
      }

      if (batch.Status !== 0) {
        throw new Error('Batch is not open');
      }

      const result = await this.pool.request().query(`
        UPDATE Batch
        SET CloseTime = GETDATE(),
            CloseEmployeeID = ${request.employeeID},
            Status = 1
        OUTPUT INSERTED.*
        WHERE BatchNumber = ${request.batchNumber}
          AND StoreID = ${request.storeID}
      `);

      logger.info(`Batch ${request.batchNumber} closed for store ${request.storeID}`);
      return result.recordset[0];
    } catch (error) {
      logger.error('Error closing batch:', error);
      throw error;
    }
  }

  /**
   * Get batch history for a store
   */
  async getBatchHistory(storeID: number, limit: number = 50): Promise<Batch[]> {
    try {
      const result = await this.pool.request().query(`
        SELECT TOP ${limit} *
        FROM Batch
        WHERE StoreID = ${storeID}
        ORDER BY OpenTime DESC
      `);

      return result.recordset;
    } catch (error) {
      logger.error(`Error getting batch history for store ${storeID}:`, error);
      throw error;
    }
  }

  /**
   * Get all open batches (across all stores)
   */
  async getAllOpenBatches(): Promise<Batch[]> {
    try {
      const result = await this.pool.request().query(`
        SELECT *
        FROM Batch
        WHERE Status = 0
        ORDER BY StoreID, OpenTime
      `);

      return result.recordset;
    } catch (error) {
      logger.error('Error getting all open batches:', error);
      throw error;
    }
  }
}



