import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import {
  CreateItemRequest,
  UpdateItemRequest,
  ItemSearchParams,
  InventoryAdjustmentRequest,
  InventoryTransferRequest,
  BulkPriceUpdateRequest,
} from '../models/inventory.types';
import { logger } from '../utils/logger';

export class InventoryController {
  private inventoryService: InventoryService;

  constructor() {
    this.inventoryService = new InventoryService();
  }

  /**
   * Get all items with filtering
   * GET /api/inventory/items
   */
  getItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: ItemSearchParams = {
        search: req.query.search as string,
        categoryID: req.query.categoryID ? parseInt(req.query.categoryID as string) : undefined,
        departmentID: req.query.departmentID ? parseInt(req.query.departmentID as string) : undefined,
        supplierID: req.query.supplierID ? parseInt(req.query.supplierID as string) : undefined,
        itemType: req.query.itemType ? parseInt(req.query.itemType as string) : undefined,
        active: req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined,
        lowStock: req.query.lowStock === 'true',
        outOfStock: req.query.outOfStock === 'true',
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 50,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const result = await this.inventoryService.getItems(params);
      res.json(result);
    } catch (error: any) {
      logger.error('Error in getItems:', error);
      next(error);
    }
  };

  /**
   * Get item by ID
   * GET /api/inventory/items/:id
   */
  getItemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
      }

      const result = await this.inventoryService.getItemById(id);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Item not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      logger.error('Error in getItemById:', error);
      next(error);
    }
  };

  /**
   * Create a new item
   * POST /api/inventory/items
   */
  createItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const request: CreateItemRequest = req.body;

      if (!request.itemLookupCode || !request.description || request.price === undefined) {
        res.status(400).json({
          error: 'Missing required fields: itemLookupCode, description, price',
        });
        return;
      }

      const item = await this.inventoryService.createItem(request);
      res.status(201).json(item);
    } catch (error: any) {
      if (error.message === 'Item lookup code already exists') {
        res.status(409).json({ error: error.message });
        return;
      }
      logger.error('Error in createItem:', error);
      next(error);
    }
  };

  /**
   * Update an item
   * PUT /api/inventory/items/:id
   */
  updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
      }

      const request: UpdateItemRequest = { ...req.body, id };
      const item = await this.inventoryService.updateItem(request);
      res.json(item);
    } catch (error: any) {
      if (error.message === 'Item not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      logger.error('Error in updateItem:', error);
      next(error);
    }
  };

  /**
   * Delete an item
   * DELETE /api/inventory/items/:id
   */
  deleteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid item ID' });
        return;
      }

      await this.inventoryService.deleteItem(id);
      res.json({ message: 'Item deleted successfully' });
    } catch (error: any) {
      logger.error('Error in deleteItem:', error);
      next(error);
    }
  };

  /**
   * Adjust inventory
   * POST /api/inventory/adjust
   */
  adjustInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const request: InventoryAdjustmentRequest = req.body;

      if (!request.itemID || !request.storeID || request.quantity === undefined) {
        res.status(400).json({
          error: 'Missing required fields: itemID, storeID, quantity',
        });
        return;
      }

      await this.inventoryService.adjustInventory(request);
      res.json({ message: 'Inventory adjusted successfully' });
    } catch (error: any) {
      logger.error('Error in adjustInventory:', error);
      next(error);
    }
  };

  /**
   * Transfer inventory
   * POST /api/inventory/transfer
   */
  transferInventory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const request: InventoryTransferRequest = req.body;

      if (
        !request.itemID ||
        !request.fromStoreID ||
        !request.toStoreID ||
        !request.quantity
      ) {
        res.status(400).json({
          error: 'Missing required fields: itemID, fromStoreID, toStoreID, quantity',
        });
        return;
      }

      await this.inventoryService.transferInventory(request);
      res.json({ message: 'Inventory transfer created successfully' });
    } catch (error: any) {
      logger.error('Error in transferInventory:', error);
      next(error);
    }
  };

  /**
   * Bulk price update
   * POST /api/inventory/bulk-price-update
   */
  bulkUpdatePrices = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const request: BulkPriceUpdateRequest = req.body;

      if (
        !request.itemIDs ||
        !Array.isArray(request.itemIDs) ||
        request.itemIDs.length === 0
      ) {
        res.status(400).json({ error: 'itemIDs must be a non-empty array' });
        return;
      }

      if (request.priceAdjustment === undefined) {
        res.status(400).json({ error: 'priceAdjustment is required' });
        return;
      }

      const updatedCount = await this.inventoryService.bulkUpdatePrices(request);
      res.json({ message: `${updatedCount} items updated successfully` });
    } catch (error: any) {
      logger.error('Error in bulkUpdatePrices:', error);
      next(error);
    }
  };

  /**
   * Get low stock items
   * GET /api/inventory/low-stock
   */
  getLowStockItems = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const storeID = req.query.storeID
        ? parseInt(req.query.storeID as string)
        : undefined;
      const items = await this.inventoryService.getLowStockItems(storeID);
      res.json(items);
    } catch (error: any) {
      logger.error('Error in getLowStockItems:', error);
      next(error);
    }
  };

  /**
   * Get inventory value
   * GET /api/inventory/value
   */
  getInventoryValue = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const value = await this.inventoryService.getInventoryValue();
      res.json(value);
    } catch (error: any) {
      logger.error('Error in getInventoryValue:', error);
      next(error);
    }
  };

  /**
   * Get categories
   * GET /api/inventory/categories
   */
  getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.inventoryService.getCategories();
      res.json(categories);
    } catch (error: any) {
      logger.error('Error in getCategories:', error);
      next(error);
    }
  };

  /**
   * Get departments
   * GET /api/inventory/departments
   */
  getDepartments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const departments = await this.inventoryService.getDepartments();
      res.json(departments);
    } catch (error: any) {
      logger.error('Error in getDepartments:', error);
      next(error);
    }
  };

  /**
   * Get suppliers
   * GET /api/inventory/suppliers
   */
  getSuppliers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const suppliers = await this.inventoryService.getSuppliers();
      res.json(suppliers);
    } catch (error: any) {
      logger.error('Error in getSuppliers:', error);
      next(error);
    }
  };
}

