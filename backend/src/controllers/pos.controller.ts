import { Request, Response } from 'express';
import { POSService } from '../services/pos.service';
import { CreateTransactionRequest } from '../models/pos.types';
import { logger } from '../utils/logger';

// Create a single instance of POS service (will be initialized on first use)
let posService: POSService | null = null;

async function getPOSService(): Promise<POSService> {
  if (!posService) {
    posService = await POSService.create();
  }
  return posService;
}

/**
 * Search for items/products
 * GET /api/pos/items?q=search&category=1&limit=50
 */
export const searchItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const categoryId = req.query.category ? parseInt(req.query.category as string) : undefined;

    const service = await getPOSService();
    const items = await service.getItems(query, categoryId);

    res.json({
      success: true,
      data: items,
      count: items.length,
    });
  } catch (error: any) {
    logger.error('Error searching items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search items',
      error: error.message,
    });
  }
};

/**
 * Get item by ID
 * GET /api/pos/items/:id
 */
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const itemId = parseInt(req.params.id);
    const service = await getPOSService();
    
    // Query item by ID from database
    const items = await service.getItems(undefined, undefined);
    const item = items.find(i => i.ID === itemId);

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found',
      });
      return;
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    logger.error('Error getting item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get item',
      error: error.message,
    });
  }
};

/**
 * Get item by barcode
 * GET /api/pos/items/barcode/:code
 */
export const getItemByBarcode = async (req: Request, res: Response): Promise<void> => {
  try {
    const barcode = req.params.code;
    const service = await getPOSService();
    const item = await service.getItemByCode(barcode);

    if (!item) {
      res.status(404).json({
        success: false,
        message: 'Item not found',
      });
      return;
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    logger.error('Error getting item by barcode:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get item by barcode',
      error: error.message,
    });
  }
};

/**
 * Search for customers
 * GET /api/pos/customers?q=search&limit=20
 */
export const searchCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = (req.query.q as string) || '';

    const service = await getPOSService();
    const customers = await service.searchCustomers(query);

    res.json({
      success: true,
      data: customers,
      count: customers.length,
    });
  } catch (error: any) {
    logger.error('Error searching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search customers',
      error: error.message,
    });
  }
};

/**
 * Get customer by ID
 * GET /api/pos/customers/:id
 */
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = parseInt(req.params.id);
    const service = await getPOSService();
    
    // Search for customer by ID
    const customers = await service.searchCustomers('');
    const customer = customers.find(c => c.ID === customerId);

    if (!customer) {
      res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
      return;
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error: any) {
    logger.error('Error getting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get customer',
      error: error.message,
    });
  }
};

/**
 * Get all active tenders (payment methods)
 * GET /api/pos/tenders
 */
export const getTenders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const service = await getPOSService();
    const tenders = await service.getTenders();

    res.json({
      success: true,
      data: tenders,
    });
  } catch (error: any) {
    logger.error('Error getting tenders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tenders',
      error: error.message,
    });
  }
};

/**
 * Create a new transaction
 * POST /api/pos/transactions
 */
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactionRequest: CreateTransactionRequest = req.body;

    // Validation
    if (!transactionRequest.items || transactionRequest.items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Transaction must have at least one item',
      });
      return;
    }

    const service = await getPOSService();

    // Check stock for all items
    for (const item of transactionRequest.items) {
      const items = await service.getItems();
      const foundItem = items.find(i => i.ID === item.itemID);
      if (!foundItem || foundItem.Quantity < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for item ${item.itemID}. Available: ${foundItem?.Quantity || 0}`,
        });
        return;
      }
    }

    const result = await service.createTransaction(transactionRequest);

    res.status(201).json({
      success: true,
      data: result,
      message: 'Transaction created successfully'
    });
  } catch (error: any) {
    logger.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message,
    });
  }
};

/**
 * Get transaction by ID
 * GET /api/pos/transactions/:id
 */
export const getTransactionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactionId = parseInt(req.params.id);
    const service = await getPOSService();
    
    // Assuming storeID 1 as default (will need proper store context later)
    const transaction = await service.getTransactionDetails(1, transactionId);

    if (!transaction) {
      res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
      return;
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    logger.error('Error getting transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction',
      error: error.message,
    });
  }
};

/**
 * Get recent transactions
 * GET /api/pos/transactions
 */
export const getRecentTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const service = await getPOSService();
    
    const result = await service.searchTransactions({
      pageSize: limit,
      page: 1
    });

    res.json({
      success: true,
      data: result.transactions,
      count: result.transactions.length,
      total: result.total
    });
  } catch (error: any) {
    logger.error('Error getting recent transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent transactions',
      error: error.message,
    });
  }
};

/**
 * Get all active categories
 * GET /api/pos/categories
 */
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const service = await getPOSService();
    const categories = await service.getCategories();

    res.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error: any) {
    logger.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message,
    });
  }
};

/**
 * Get all active departments
 * GET /api/pos/departments
 */
export const getDepartments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const service = await getPOSService();
    const departments = await service.getDepartments();

    res.json({
      success: true,
      data: departments,
      count: departments.length,
    });
  } catch (error: any) {
    logger.error('Error getting departments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get departments',
      error: error.message,
    });
  }
};
