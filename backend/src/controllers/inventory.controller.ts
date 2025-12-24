import { Request, Response } from 'express';
import { getConnection } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Get total inventory value
 * GET /api/inventory/value
 */
export const getInventoryValue = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = await getConnection();
    
    // Query real database for inventory statistics
    const result = await pool.request().query(`
      SELECT 
        COUNT(*) as ItemCount,
        ISNULL(SUM(CAST(Quantity as FLOAT)), 0) as TotalUnits,
        ISNULL(SUM(CAST(Cost as FLOAT) * CAST(Quantity as FLOAT)), 0) as CostValue,
        ISNULL(SUM(CAST(Price as FLOAT) * CAST(Quantity as FLOAT)), 0) as RetailValue
      FROM Item
      WHERE ISNULL(Inactive, 0) = 0
    `);
    
    const stats = result.recordset[0];
    const costValue = stats.CostValue || 0;
    const retailValue = stats.RetailValue || 0;
    
    logger.info(`Inventory value calculated: ${stats.ItemCount} items, $${costValue.toFixed(2)} cost`);
    
    res.json({
      success: true,
      data: {
        costValue: costValue,
        retailValue: retailValue,
        potentialProfit: retailValue - costValue,
        itemCount: stats.ItemCount || 0,
        totalUnits: stats.TotalUnits || 0,
      },
    });
  } catch (error: any) {
    logger.error('Error getting inventory value:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get inventory value',
      error: error.message,
    });
  }
};

/**
 * Get low stock items
 * GET /api/inventory/low-stock
 */
export const getLowStockItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = await getConnection();
    
    // Query real database for low stock items
    const lowStockResult = await pool.request().query(`
      SELECT TOP 20
        ID,
        ItemLookupCode,
        Description,
        Quantity,
        ReorderPoint,
        Price,
        Cost
      FROM Item
      WHERE ISNULL(Inactive, 0) = 0
        AND Quantity > 0
        AND Quantity <= ISNULL(ReorderPoint, 0)
      ORDER BY Quantity ASC
    `);
    
    // Query for out of stock items
    const outOfStockResult = await pool.request().query(`
      SELECT TOP 20
        ID,
        ItemLookupCode,
        Description,
        Quantity,
        ReorderPoint,
        Price,
        Cost
      FROM Item
      WHERE ISNULL(Inactive, 0) = 0
        AND Quantity <= 0
      ORDER BY Description ASC
    `);
    
    const lowStockItems = lowStockResult.recordset;
    const outOfStockItems = outOfStockResult.recordset;
    
    logger.info(`Low stock items: ${lowStockItems.length}, Out of stock: ${outOfStockItems.length}`);
    
    res.json({
      success: true,
      data: {
        lowStock: lowStockItems,
        outOfStock: outOfStockItems,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
      },
    });
  } catch (error: any) {
    logger.error('Error getting low stock items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get low stock items',
      error: error.message,
    });
  }
};

/**
 * Get all inventory items
 * GET /api/inventory/items
 */
export const getAllItems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pool = await getConnection();
    
    // Query real database for all items
    const result = await pool.request().query(`
      SELECT TOP 100
        ID,
        ItemLookupCode,
        Description,
        Quantity,
        ReorderPoint,
        Price,
        Cost,
        CategoryID,
        DepartmentID,
        SupplierID,
        Inactive
      FROM Item
      WHERE ISNULL(Inactive, 0) = 0
      ORDER BY Description ASC
    `);
    
    const items = result.recordset;
    
    logger.info(`Retrieved ${items.length} inventory items from database`);
    
    res.json({
      success: true,
      data: items,
      count: items.length,
    });
  } catch (error: any) {
    logger.error('Error getting inventory items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get inventory items',
      error: error.message,
    });
  }
};
