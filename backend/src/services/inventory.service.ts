import { ConnectionPool, Transaction as SqlTransaction } from 'mssql';
import { getPool } from '../config/database';
import {
  Item,
  Category,
  Department,
  Supplier,
  CreateItemRequest,
  UpdateItemRequest,
  ItemSearchParams,
  ItemResponse,
  InventoryAdjustmentRequest,
  InventoryTransferRequest,
  BulkPriceUpdateRequest,
  StockLevel,
  InventoryValue,
  Dimension,
  Kit,
  Serial,
  Alias,
} from '../models/inventory.types';
import { logger } from '../utils/logger';

export class InventoryService {
  private pool: ConnectionPool;

  constructor() {
    this.pool = getPool();
  }

  /**
   * Get all items with filtering and pagination
   */
  async getItems(params: ItemSearchParams): Promise<{ items: Item[]; total: number }> {
    try {
      const page = params.page || 1;
      const pageSize = params.pageSize || 50;
      const offset = (page - 1) * pageSize;
      const sortBy = params.sortBy || 'Description';
      const sortOrder = params.sortOrder || 'asc';

      let whereClause = 'WHERE 1=1';
      
      if (params.search) {
        whereClause += ` AND (ItemLookupCode LIKE '%${params.search}%' OR Description LIKE '%${params.search}%')`;
      }
      if (params.categoryID) whereClause += ` AND CategoryID = ${params.categoryID}`;
      if (params.departmentID) whereClause += ` AND DepartmentID = ${params.departmentID}`;
      if (params.supplierID) whereClause += ` AND SupplierID = ${params.supplierID}`;
      if (params.itemType !== undefined) whereClause += ` AND ItemType = ${params.itemType}`;
      if (params.active !== undefined) whereClause += ` AND Active = ${params.active ? 1 : 0}`;
      if (params.lowStock) whereClause += ` AND Quantity <= ISNULL(ReorderPoint, 0)`;
      if (params.outOfStock) whereClause += ` AND Quantity <= 0`;

      const countResult = await this.pool.request().query(`
        SELECT COUNT(*) as Total FROM Item ${whereClause}
      `);

      const result = await this.pool.request().query(`
        SELECT * FROM Item
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder}
        OFFSET ${offset} ROWS
        FETCH NEXT ${pageSize} ROWS ONLY
      `);

      return {
        items: result.recordset,
        total: countResult.recordset[0].Total,
      };
    } catch (error) {
      logger.error('Error getting items:', error);
      throw error;
    }
  }

  /**
   * Get item by ID with related data
   */
  async getItemById(id: number): Promise<ItemResponse> {
    try {
      const itemResult = await this.pool.request().query(`
        SELECT * FROM Item WHERE ID = ${id}
      `);

      if (itemResult.recordset.length === 0) {
        throw new Error('Item not found');
      }

      const item = itemResult.recordset[0];

      // Get category
      let category = undefined;
      if (item.CategoryID) {
        const catResult = await this.pool.request().query(`
          SELECT * FROM Category WHERE ID = ${item.CategoryID}
        `);
        if (catResult.recordset.length > 0) {
          category = catResult.recordset[0];
        }
      }

      // Get department
      let department = undefined;
      if (item.DepartmentID) {
        const deptResult = await this.pool.request().query(`
          SELECT * FROM Department WHERE ID = ${item.DepartmentID}
        `);
        if (deptResult.recordset.length > 0) {
          department = deptResult.recordset[0];
        }
      }

      // Get supplier
      let supplier = undefined;
      if (item.SupplierID) {
        const suppResult = await this.pool.request().query(`
          SELECT * FROM Supplier WHERE ID = ${item.SupplierID}
        `);
        if (suppResult.recordset.length > 0) {
          supplier = suppResult.recordset[0];
        }
      }

      // Get aliases
      const aliasResult = await this.pool.request().query(`
        SELECT * FROM Alias WHERE ItemID = ${id}
      `);

      // Get dimensions (for matrix items)
      const dimensionResult = await this.pool.request().query(`
        SELECT * FROM Dimension WHERE ItemID = ${id}
      `);

      // Get kit components (for kit items)
      const kitResult = await this.pool.request().query(`
        SELECT k.*, i.ItemLookupCode, i.Description
        FROM Kit k
        LEFT JOIN Item i ON k.ComponentID = i.ID
        WHERE k.ItemID = ${id}
      `);

      return {
        item,
        category,
        department,
        supplier,
        aliases: aliasResult.recordset,
        dimensions: dimensionResult.recordset,
        kitComponents: kitResult.recordset,
      };
    } catch (error) {
      logger.error('Error getting item by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new item
   */
  async createItem(request: CreateItemRequest): Promise<Item> {
    const transaction = new SqlTransaction(this.pool);

    try {
      await transaction.begin();

      // Check if item lookup code already exists
      const checkResult = await transaction.request().query(`
        SELECT ID FROM Item WHERE ItemLookupCode = '${request.itemLookupCode}'
      `);

      if (checkResult.recordset.length > 0) {
        throw new Error('Item lookup code already exists');
      }

      // Get next ID
      const idResult = await transaction.request().query(`
        SELECT ISNULL(MAX(ID), 0) + 1 as NextID FROM Item
      `);
      const nextID = idResult.recordset[0].NextID;

      // Insert item
      await transaction.request().query(`
        INSERT INTO Item (
          ID, ItemLookupCode, Description,
          SubDescription1, SubDescription2, SubDescription3,
          CategoryID, DepartmentID, SupplierID,
          Price, Cost, Quantity,
          ReorderPoint, RestockLevel, BinLocation,
          ItemNotDiscountable, ItemType, Active,
          UnitOfMeasure, Taxable, TaxCode, Notes,
          ExtendedDescription, DateCreated
        ) VALUES (
          ${nextID},
          '${request.itemLookupCode}',
          '${request.description.replace(/'/g, "''")}',
          ${request.subDescription1 ? `'${request.subDescription1.replace(/'/g, "''")}'` : 'NULL'},
          ${request.subDescription2 ? `'${request.subDescription2.replace(/'/g, "''")}'` : 'NULL'},
          ${request.subDescription3 ? `'${request.subDescription3.replace(/'/g, "''")}'` : 'NULL'},
          ${request.categoryID || 'NULL'},
          ${request.departmentID || 'NULL'},
          ${request.supplierID || 'NULL'},
          ${request.price},
          ${request.cost || 0},
          ${request.quantity},
          ${request.reorderPoint || 'NULL'},
          ${request.restockLevel || 'NULL'},
          ${request.binLocation ? `'${request.binLocation}'` : 'NULL'},
          ${request.itemNotDiscountable ? 1 : 0},
          ${request.itemType || 0},
          1,
          ${request.unitOfMeasure ? `'${request.unitOfMeasure}'` : 'NULL'},
          ${request.taxable ? 1 : 0},
          ${request.taxCode || 'NULL'},
          ${request.notes ? `'${request.notes.replace(/'/g, "''")}'` : 'NULL'},
          ${request.extendedDescription ? `'${request.extendedDescription.replace(/'/g, "''")}'` : 'NULL'},
          GETDATE()
        )
      `);

      await transaction.commit();

      // Fetch and return the created item
      const result = await this.pool.request().query(`
        SELECT * FROM Item WHERE ID = ${nextID}
      `);

      logger.info(`Item ${nextID} created successfully`);
      return result.recordset[0];
    } catch (error) {
      await transaction.rollback();
      logger.error('Error creating item:', error);
      throw error;
    }
  }

  /**
   * Update an existing item
   */
  async updateItem(request: UpdateItemRequest): Promise<Item> {
    try {
      const updates: string[] = [];

      if (request.itemLookupCode !== undefined) updates.push(`ItemLookupCode = '${request.itemLookupCode}'`);
      if (request.description !== undefined) updates.push(`Description = '${request.description.replace(/'/g, "''")}'`);
      if (request.subDescription1 !== undefined) updates.push(`SubDescription1 = ${request.subDescription1 ? `'${request.subDescription1.replace(/'/g, "''")}'` : 'NULL'}`);
      if (request.subDescription2 !== undefined) updates.push(`SubDescription2 = ${request.subDescription2 ? `'${request.subDescription2.replace(/'/g, "''")}'` : 'NULL'}`);
      if (request.subDescription3 !== undefined) updates.push(`SubDescription3 = ${request.subDescription3 ? `'${request.subDescription3.replace(/'/g, "''")}'` : 'NULL'}`);
      if (request.categoryID !== undefined) updates.push(`CategoryID = ${request.categoryID || 'NULL'}`);
      if (request.departmentID !== undefined) updates.push(`DepartmentID = ${request.departmentID || 'NULL'}`);
      if (request.supplierID !== undefined) updates.push(`SupplierID = ${request.supplierID || 'NULL'}`);
      if (request.price !== undefined) updates.push(`Price = ${request.price}`);
      if (request.cost !== undefined) updates.push(`Cost = ${request.cost || 0}`);
      if (request.quantity !== undefined) updates.push(`Quantity = ${request.quantity}`);
      if (request.reorderPoint !== undefined) updates.push(`ReorderPoint = ${request.reorderPoint || 'NULL'}`);
      if (request.restockLevel !== undefined) updates.push(`RestockLevel = ${request.restockLevel || 'NULL'}`);
      if (request.binLocation !== undefined) updates.push(`BinLocation = ${request.binLocation ? `'${request.binLocation}'` : 'NULL'}`);
      if (request.itemNotDiscountable !== undefined) updates.push(`ItemNotDiscountable = ${request.itemNotDiscountable ? 1 : 0}`);
      if (request.unitOfMeasure !== undefined) updates.push(`UnitOfMeasure = ${request.unitOfMeasure ? `'${request.unitOfMeasure}'` : 'NULL'}`);
      if (request.taxable !== undefined) updates.push(`Taxable = ${request.taxable ? 1 : 0}`);
      if (request.taxCode !== undefined) updates.push(`TaxCode = ${request.taxCode || 'NULL'}`);
      if (request.notes !== undefined) updates.push(`Notes = ${request.notes ? `'${request.notes.replace(/'/g, "''")}'` : 'NULL'}`);
      if (request.extendedDescription !== undefined) updates.push(`ExtendedDescription = ${request.extendedDescription ? `'${request.extendedDescription.replace(/'/g, "''")}'` : 'NULL'}`);

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      await this.pool.request().query(`
        UPDATE Item
        SET ${updates.join(', ')}
        WHERE ID = ${request.id}
      `);

      const result = await this.pool.request().query(`
        SELECT * FROM Item WHERE ID = ${request.id}
      `);

      if (result.recordset.length === 0) {
        throw new Error('Item not found');
      }

      logger.info(`Item ${request.id} updated successfully`);
      return result.recordset[0];
    } catch (error) {
      logger.error('Error updating item:', error);
      throw error;
    }
  }

  /**
   * Delete an item (soft delete by setting Active = false)
   */
  async deleteItem(id: number): Promise<void> {
    try {
      await this.pool.request().query(`
        UPDATE Item SET Active = 0 WHERE ID = ${id}
      `);
      logger.info(`Item ${id} deleted (deactivated)`);
    } catch (error) {
      logger.error('Error deleting item:', error);
      throw error;
    }
  }

  /**
   * Adjust inventory quantity
   */
  async adjustInventory(request: InventoryAdjustmentRequest): Promise<void> {
    const transaction = new SqlTransaction(this.pool);

    try {
      await transaction.begin();

      // Update item quantity
      await transaction.request().query(`
        UPDATE Item
        SET Quantity = Quantity + ${request.quantity}
        WHERE ID = ${request.itemID}
      `);

      // Get next ID for inventory offline record
      const idResult = await transaction.request().query(`
        SELECT ISNULL(MAX(ID), 0) + 1 as NextID FROM InventoryOffline
      `);
      const nextID = idResult.recordset[0].NextID;

      // Log adjustment
      await transaction.request().query(`
        INSERT INTO InventoryOffline (
          ID, ItemID, StoreID, Quantity, ReasonCode, Comment, AdjustmentDate
        ) VALUES (
          ${nextID},
          ${request.itemID},
          ${request.storeID},
          ${request.quantity},
          ${request.reasonCode ? `'${request.reasonCode}'` : 'NULL'},
          ${request.comment ? `'${request.comment.replace(/'/g, "''")}'` : 'NULL'},
          GETDATE()
        )
      `);

      await transaction.commit();
      logger.info(`Inventory adjusted for item ${request.itemID}`);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error adjusting inventory:', error);
      throw error;
    }
  }

  /**
   * Transfer inventory between stores
   */
  async transferInventory(request: InventoryTransferRequest): Promise<void> {
    const transaction = new SqlTransaction(this.pool);

    try {
      await transaction.begin();

      // Get next ID
      const idResult = await transaction.request().query(`
        SELECT ISNULL(MAX(ID), 0) + 1 as NextID FROM InventoryTransferLog
      `);
      const nextID = idResult.recordset[0].NextID;

      // Create transfer log
      await transaction.request().query(`
        INSERT INTO InventoryTransferLog (
          ID, ItemID, FromStoreID, ToStoreID, Quantity, TransferDate, Status, Notes
        ) VALUES (
          ${nextID},
          ${request.itemID},
          ${request.fromStoreID},
          ${request.toStoreID},
          ${request.quantity},
          GETDATE(),
          2,
          ${request.notes ? `'${request.notes.replace(/'/g, "''")}'` : 'NULL'}
        )
      `);

      // Note: Actual store-specific inventory would require Item table modifications
      // or a separate StoreInventory table. For now, we just log the transfer.

      await transaction.commit();
      logger.info(`Inventory transfer created for item ${request.itemID}`);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error transferring inventory:', error);
      throw error;
    }
  }

  /**
   * Bulk price update
   */
  async bulkUpdatePrices(request: BulkPriceUpdateRequest): Promise<number> {
    try {
      const itemIDsList = request.itemIDs.join(',');
      
      let updateQuery = '';
      if (request.adjustmentType === 'amount') {
        updateQuery = `Price = Price + ${request.priceAdjustment}`;
      } else {
        updateQuery = `Price = Price * (1 + ${request.priceAdjustment / 100})`;
      }

      const result = await this.pool.request().query(`
        UPDATE Item
        SET ${updateQuery}
        WHERE ID IN (${itemIDsList})
      `);

      logger.info(`Bulk price update: ${result.rowsAffected[0]} items updated`);
      return result.rowsAffected[0] || 0;
    } catch (error) {
      logger.error('Error in bulk price update:', error);
      throw error;
    }
  }

  /**
   * Get low stock items
   */
  async getLowStockItems(storeID?: number): Promise<StockLevel[]> {
    try {
      let whereClause = 'WHERE Active = 1 AND Quantity <= ISNULL(ReorderPoint, 0)';
      
      const result = await this.pool.request().query(`
        SELECT
          ID as itemID,
          ItemLookupCode as itemLookupCode,
          Description as description,
          Quantity as quantity,
          ReorderPoint as reorderPoint,
          RestockLevel as restockLevel,
          CASE
            WHEN Quantity <= 0 THEN 'out'
            WHEN Quantity <= ISNULL(ReorderPoint, 0) THEN 'low'
            ELSE 'ok'
          END as status
        FROM Item
        ${whereClause}
        ORDER BY Quantity ASC
      `);

      return result.recordset;
    } catch (error) {
      logger.error('Error getting low stock items:', error);
      throw error;
    }
  }

  /**
   * Get inventory value
   */
  async getInventoryValue(): Promise<InventoryValue> {
    try {
      const result = await this.pool.request().query(`
        SELECT
          COUNT(*) as totalItems,
          SUM(Quantity) as totalQuantity,
          SUM(Cost * Quantity) as totalCost,
          SUM(Price * Quantity) as totalRetail,
          SUM((Price - ISNULL(Cost, 0)) * Quantity) as potentialProfit
        FROM Item
        WHERE Active = 1
      `);

      return result.recordset[0];
    } catch (error) {
      logger.error('Error getting inventory value:', error);
      throw error;
    }
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const result = await this.pool.request().query(`
        SELECT * FROM Category WHERE Active = 1 ORDER BY Name
      `);
      return result.recordset;
    } catch (error) {
      logger.error('Error getting categories:', error);
      throw error;
    }
  }

  /**
   * Get all departments
   */
  async getDepartments(): Promise<Department[]> {
    try {
      const result = await this.pool.request().query(`
        SELECT * FROM Department WHERE Active = 1 ORDER BY Name
      `);
      return result.recordset;
    } catch (error) {
      logger.error('Error getting departments:', error);
      throw error;
    }
  }

  /**
   * Get all suppliers
   */
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const result = await this.pool.request().query(`
        SELECT * FROM Supplier WHERE Active = 1 ORDER BY CompanyName
      `);
      return result.recordset;
    } catch (error) {
      logger.error('Error getting suppliers:', error);
      throw error;
    }
  }
}

