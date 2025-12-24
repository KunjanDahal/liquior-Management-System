import { ConnectionPool, Transaction as SqlTransaction } from 'mssql';
import { getConnection } from '../config/database';
import {
  CreateTransactionRequest,
  TransactionResponse,
  TransactionSearchParams,
  TransactionDetailResponse,
  Transaction,
  Item,
  Customer,
  Tender,
} from '../models/pos.types';
import { logger } from '../utils/logger';

export class POSService {
  private pool: ConnectionPool;

  constructor(pool: ConnectionPool) {
    this.pool = pool;
  }

  static async create(): Promise<POSService> {
    const pool = await getConnection();
    return new POSService(pool);
  }

  /**
   * Create a new POS transaction
   */
  async createTransaction(
    request: CreateTransactionRequest
  ): Promise<TransactionResponse> {
    const transaction = new SqlTransaction(this.pool);

    try {
      await transaction.begin();

      // 1. Get next transaction number
      const transactionNumber = await this.getNextTransactionNumber(
        transaction,
        request.storeID
      );

      // 2. Get current batch number
      const batchNumber = await this.getCurrentBatchNumber(
        transaction,
        request.storeID,
        request.registerID
      );

      // 3. Calculate totals
      const { subtotal, taxTotal, total } = await this.calculateTransactionTotals(
        transaction,
        request.items
      );

      // 4. Validate tender amounts
      const tenderTotal = request.tenders.reduce((sum, t) => sum + t.amount, 0);
      if (tenderTotal < total) {
        throw new Error('Tender amount is less than transaction total');
      }
      const changeAmount = tenderTotal - total;

      // 5. Insert Transaction header
      await transaction.request().query(`
        INSERT INTO [Transaction] (
          TransactionNumber, StoreID, BatchNumber, Time,
          CustomerID, CashierID, RegisterID,
          Total, Subtotal, TaxTotal, Status
        ) VALUES (
          ${transactionNumber}, ${request.storeID}, ${batchNumber}, GETDATE(),
          ${request.customerID || 'NULL'}, ${request.cashierID}, '${request.registerID}',
          ${total}, ${subtotal}, ${taxTotal}, 0
        )
      `);

      // 6. Insert Transaction entries
      for (let i = 0; i < request.items.length; i++) {
        const item = request.items[i];
        const itemDetails = await this.getItemDetails(transaction, item.itemID);
        const price = item.price || itemDetails.Price;
        const extendedPrice = price * item.quantity;

        await transaction.request().query(`
          INSERT INTO TransactionEntry (
            TransactionNumber, StoreID, BatchNumber,
            ItemID, Price, Quantity, Taxable,
            ExtendedPrice, Cost, LineNumber,
            Comment, SerialNumber, DiscountReasonCodeID
          ) VALUES (
            ${transactionNumber}, ${request.storeID}, ${batchNumber},
            ${item.itemID}, ${price}, ${item.quantity}, ${itemDetails.Taxable ? 1 : 0},
            ${extendedPrice}, ${itemDetails.Cost || 0}, ${i + 1},
            ${item.comment ? `'${item.comment.replace(/'/g, "''")}'` : 'NULL'},
            ${item.serialNumber ? `'${item.serialNumber}'` : 'NULL'},
            ${item.discountReasonCodeID || 'NULL'}
          )
        `);

        // Update item quantity
        await transaction.request().query(`
          UPDATE Item
          SET Quantity = Quantity - ${item.quantity}
          WHERE ID = ${item.itemID}
        `);
      }

      // 7. Insert Tax entries
      const taxes = await this.calculateTaxes(transaction, request.items, subtotal);
      for (const tax of taxes) {
        await transaction.request().query(`
          INSERT INTO TaxEntry (
            TransactionNumber, StoreID, BatchNumber,
            TaxID, TaxableAmount, TaxAmount, TaxPercentage
          ) VALUES (
            ${transactionNumber}, ${request.storeID}, ${batchNumber},
            ${tax.taxID}, ${tax.taxableAmount}, ${tax.taxAmount}, ${tax.taxPercentage}
          )
        `);
      }

      // 8. Insert Tender entries
      for (const tender of request.tenders) {
        await transaction.request().query(`
          INSERT INTO TenderEntry (
            TransactionNumber, StoreID, BatchNumber,
            TenderID, Amount, AuthorizationCode,
            CardNumber, CardType, CheckNumber
          ) VALUES (
            ${transactionNumber}, ${request.storeID}, ${batchNumber},
            ${tender.tenderID}, ${tender.amount},
            ${tender.authorizationCode ? `'${tender.authorizationCode}'` : 'NULL'},
            ${tender.cardNumber ? `'${tender.cardNumber}'` : 'NULL'},
            ${tender.cardType ? `'${tender.cardType}'` : 'NULL'},
            ${tender.checkNumber ? `'${tender.checkNumber}'` : 'NULL'}
          )
        `);
      }

      // 9. Create receipt
      const receiptNumber = await this.generateReceiptNumber(
        transaction,
        request.storeID,
        transactionNumber
      );
      await transaction.request().query(`
        INSERT INTO Receipt (
          TransactionNumber, StoreID, BatchNumber,
          ReceiptNumber, PrintDate, Reprinted, ReprintCount, ReceiptType
        ) VALUES (
          ${transactionNumber}, ${request.storeID}, ${batchNumber},
          '${receiptNumber}', GETDATE(), 0, 0, 0
        )
      `);

      await transaction.commit();

      logger.info(`Transaction ${transactionNumber} created successfully`);

      return {
        transactionNumber,
        storeID: request.storeID,
        batchNumber,
        total,
        subtotal,
        taxTotal,
        changeAmount,
        receiptNumber,
        timestamp: new Date(),
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Search transactions with filters
   */
  async searchTransactions(
    params: TransactionSearchParams
  ): Promise<{ transactions: Transaction[]; total: number }> {
    try {
      const page = params.page || 1;
      const pageSize = params.pageSize || 20;
      const offset = (page - 1) * pageSize;

      let whereClause = 'WHERE 1=1';
      if (params.storeID) whereClause += ` AND t.StoreID = ${params.storeID}`;
      if (params.customerID) whereClause += ` AND t.CustomerID = ${params.customerID}`;
      if (params.cashierID) whereClause += ` AND t.CashierID = ${params.cashierID}`;
      if (params.status !== undefined) whereClause += ` AND t.Status = ${params.status}`;
      if (params.minAmount) whereClause += ` AND t.Total >= ${params.minAmount}`;
      if (params.maxAmount) whereClause += ` AND t.Total <= ${params.maxAmount}`;
      if (params.startDate) {
        whereClause += ` AND t.Time >= '${params.startDate.toISOString()}'`;
      }
      if (params.endDate) {
        whereClause += ` AND t.Time <= '${params.endDate.toISOString()}'`;
      }

      const countResult = await this.pool.request().query(`
        SELECT COUNT(*) as Total
        FROM [Transaction] t
        ${whereClause}
      `);

      const result = await this.pool.request().query(`
        SELECT t.*
        FROM [Transaction] t
        ${whereClause}
        ORDER BY t.Time DESC
        OFFSET ${offset} ROWS
        FETCH NEXT ${pageSize} ROWS ONLY
      `);

      return {
        transactions: result.recordset,
        total: countResult.recordset[0].Total,
      };
    } catch (error) {
      logger.error('Error searching transactions:', error);
      throw error;
    }
  }

  /**
   * Get transaction details by transaction number
   */
  async getTransactionDetails(
    storeID: number,
    transactionNumber: number
  ): Promise<TransactionDetailResponse> {
    try {
      const transactionResult = await this.pool.request().query(`
        SELECT * FROM [Transaction]
        WHERE StoreID = ${storeID} AND TransactionNumber = ${transactionNumber}
      `);

      if (transactionResult.recordset.length === 0) {
        throw new Error('Transaction not found');
      }

      const transaction = transactionResult.recordset[0];

      const entriesResult = await this.pool.request().query(`
        SELECT te.*, i.ItemLookupCode, i.Description as ItemDescription
        FROM TransactionEntry te
        LEFT JOIN Item i ON te.ItemID = i.ID
        WHERE te.StoreID = ${storeID} AND te.TransactionNumber = ${transactionNumber}
        ORDER BY te.LineNumber
      `);

      const tendersResult = await this.pool.request().query(`
        SELECT te.*, t.Description as TenderDescription
        FROM TenderEntry te
        LEFT JOIN Tender t ON te.TenderID = t.TenderID
        WHERE te.StoreID = ${storeID} AND te.TransactionNumber = ${transactionNumber}
      `);

      const taxesResult = await this.pool.request().query(`
        SELECT te.*, t.TaxCode, t.Description as TaxDescription
        FROM TaxEntry te
        LEFT JOIN Tax t ON te.TaxID = t.ID
        WHERE te.StoreID = ${storeID} AND te.TransactionNumber = ${transactionNumber}
      `);

      let customer = undefined;
      if (transaction.CustomerID) {
        const customerResult = await this.pool.request().query(`
          SELECT * FROM Customer WHERE ID = ${transaction.CustomerID}
        `);
        if (customerResult.recordset.length > 0) {
          customer = customerResult.recordset[0];
        }
      }

      let cashier = undefined;
      if (transaction.CashierID) {
        const cashierResult = await this.pool.request().query(`
          SELECT * FROM Cashier WHERE ID = ${transaction.CashierID}
        `);
        if (cashierResult.recordset.length > 0) {
          cashier = cashierResult.recordset[0];
        }
      }

      const receiptResult = await this.pool.request().query(`
        SELECT * FROM Receipt
        WHERE StoreID = ${storeID} AND TransactionNumber = ${transactionNumber}
      `);
      const receipt = receiptResult.recordset[0];

      return {
        transaction,
        entries: entriesResult.recordset,
        tenders: tendersResult.recordset,
        taxes: taxesResult.recordset,
        customer,
        cashier,
        receipt,
      };
    } catch (error) {
      logger.error('Error getting transaction details:', error);
      throw error;
    }
  }

  /**
   * Get list of available items for POS
   */
  async getItems(search?: string, categoryID?: number): Promise<Item[]> {
    try {
      let whereClause = 'WHERE ISNULL(Inactive, 0) = 0';
      if (search) {
        whereClause += ` AND (ItemLookupCode LIKE '%${search}%' OR Description LIKE '%${search}%')`;
      }
      if (categoryID) {
        whereClause += ` AND CategoryID = ${categoryID}`;
      }

      const result = await this.pool.request().query(`
        SELECT TOP 100 *
        FROM Item
        ${whereClause}
        ORDER BY Description
      `);

      return result.recordset;
    } catch (error) {
      logger.error('Error getting items:', error);
      throw error;
    }
  }

  /**
   * Get item by barcode/lookup code
   */
  async getItemByCode(code: string): Promise<Item | null> {
    try {
      const result = await this.pool.request().query(`
        SELECT * FROM Item
        WHERE ItemLookupCode = '${code}' AND ISNULL(Inactive, 0) = 0
      `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      logger.error('Error getting item by code:', error);
      throw error;
    }
  }

  /**
   * Get available tenders
   */
  async getTenders(): Promise<Tender[]> {
    try {
      const result = await this.pool.request().query(`
        SELECT * FROM Tender
        WHERE ISNULL(Inactive, 0) = 0
        ORDER BY Description
      `);

      return result.recordset;
    } catch (error) {
      logger.error('Error getting tenders:', error);
      throw error;
    }
  }

  /**
   * Get customer by account number
   */
  async getCustomerByAccount(accountNumber: string): Promise<Customer | null> {
    try {
      const result = await this.pool.request().query(`
        SELECT * FROM Customer
        WHERE AccountNumber = '${accountNumber}'
      `);

      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      logger.error('Error getting customer:', error);
      throw error;
    }
  }

  /**
   * Search customers
   */
  async searchCustomers(search: string): Promise<Customer[]> {
    try {
      const result = await this.pool.request().query(`
        SELECT TOP 20 *
        FROM Customer
        WHERE (
          FirstName LIKE '%${search}%'
          OR LastName LIKE '%${search}%'
          OR Company LIKE '%${search}%'
          OR AccountNumber LIKE '%${search}%'
          OR PhoneNumber LIKE '%${search}%'
        )
        ORDER BY LastName, FirstName
      `);

      return result.recordset;
    } catch (error) {
      logger.error('Error searching customers:', error);
      throw error;
    }
  }

  /**
   * Get all active categories
   */
  async getCategories(): Promise<any[]> {
    try {
      const result = await this.pool.request().query(`
        SELECT *
        FROM Category
        ORDER BY Name
      `);

      return result.recordset;
    } catch (error) {
      logger.error('Error getting categories:', error);
      throw error;
    }
  }

  /**
   * Get all active departments
   */
  async getDepartments(): Promise<any[]> {
    try {
      const result = await this.pool.request().query(`
        SELECT *
        FROM Department
        ORDER BY Name
      `);

      return result.recordset;
    } catch (error) {
      logger.error('Error getting departments:', error);
      throw error;
    }
  }

  // Private helper methods

  private async getNextTransactionNumber(
    transaction: SqlTransaction,
    storeID: number
  ): Promise<number> {
    const result = await transaction.request().query(`
      SELECT ISNULL(MAX(TransactionNumber), 0) + 1 as NextNumber
      FROM [Transaction]
      WHERE StoreID = ${storeID}
    `);
    return result.recordset[0].NextNumber;
  }

  private async getCurrentBatchNumber(
    transaction: SqlTransaction,
    storeID: number,
    registerID: string
  ): Promise<number> {
    const result = await transaction.request().query(`
      SELECT ISNULL(MAX(BatchNumber), 1) as BatchNumber
      FROM Batch
      WHERE StoreID = ${storeID} AND RegisterID = '${registerID}'
      AND CAST([Date] as DATE) = CAST(GETDATE() as DATE)
    `);
    return result.recordset[0].BatchNumber || 1;
  }

  private async getItemDetails(
    transaction: SqlTransaction,
    itemID: number
  ): Promise<Item> {
    const result = await transaction.request().query(`
      SELECT * FROM Item WHERE ID = ${itemID}
    `);
    if (result.recordset.length === 0) {
      throw new Error(`Item ${itemID} not found`);
    }
    return result.recordset[0];
  }

  private async calculateTransactionTotals(
    transaction: SqlTransaction,
    items: any[]
  ): Promise<{ subtotal: number; taxTotal: number; total: number }> {
    let subtotal = 0;
    let taxableAmount = 0;

    for (const item of items) {
      const itemDetails = await this.getItemDetails(transaction, item.itemID);
      const price = item.price || itemDetails.Price;
      const extendedPrice = price * item.quantity;
      subtotal += extendedPrice;

      if (itemDetails.Taxable) {
        taxableAmount += extendedPrice;
      }
    }

    // Get default tax rate (simplified - in reality you'd need more complex tax logic)
    const taxResult = await transaction.request().query(`
      SELECT TOP 1 Percentage FROM Tax ORDER BY ID
    `);
    const taxRate = taxResult.recordset.length > 0 ? taxResult.recordset[0].Percentage : 0;
    const taxTotal = (taxableAmount * taxRate) / 100;

    return {
      subtotal,
      taxTotal,
      total: subtotal + taxTotal,
    };
  }

  private async calculateTaxes(
    transaction: SqlTransaction,
    items: any[],
    _subtotal: number
  ): Promise<Array<{ taxID: number; taxableAmount: number; taxAmount: number; taxPercentage: number }>> {
    const taxes: Array<{ taxID: number; taxableAmount: number; taxAmount: number; taxPercentage: number }> = [];

    let taxableAmount = 0;
    for (const item of items) {
      const itemDetails = await this.getItemDetails(transaction, item.itemID);
      if (itemDetails.Taxable) {
        const price = item.price || itemDetails.Price;
        taxableAmount += price * item.quantity;
      }
    }

    if (taxableAmount > 0) {
      // Get active taxes from database
      const taxResult = await transaction.request().query(`
        SELECT ID as TaxID, Percentage as TaxPercentage, Description
        FROM Tax
      `);

      for (const tax of taxResult.recordset) {
        const taxAmount = (taxableAmount * tax.TaxPercentage) / 100;
        taxes.push({
          taxID: tax.TaxID,
          taxableAmount,
          taxAmount,
          taxPercentage: tax.TaxPercentage,
        });
      }
    }

    return taxes;
  }

  private async generateReceiptNumber(
    _transaction: SqlTransaction,
    storeID: number,
    transactionNumber: number
  ): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    return `${storeID}-${dateStr}-${transactionNumber}`;
  }
}

