import { Request, Response, NextFunction } from 'express';
import { POSService } from '../services/pos.service';
import { CreateTransactionRequest, TransactionSearchParams } from '../models/pos.types';
import { logger } from '../utils/logger';

export class POSController {
  private posService: POSService;

  constructor() {
    this.posService = new POSService();
  }

  /**
   * Create a new transaction
   * POST /api/pos/transactions
   */
  createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const request: CreateTransactionRequest = req.body;

      // Validate request
      if (!request.storeID || !request.registerID || !request.cashierID) {
        res.status(400).json({
          error: 'Missing required fields: storeID, registerID, cashierID',
        });
        return;
      }

      if (!request.items || request.items.length === 0) {
        res.status(400).json({ error: 'Transaction must have at least one item' });
        return;
      }

      if (!request.tenders || request.tenders.length === 0) {
        res.status(400).json({ error: 'Transaction must have at least one tender' });
        return;
      }

      const result = await this.posService.createTransaction(request);
      res.status(201).json(result);
    } catch (error: any) {
      logger.error('Error in createTransaction:', error);
      next(error);
    }
  };

  /**
   * Search transactions
   * GET /api/pos/transactions
   */
  searchTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const params: TransactionSearchParams = {
        storeID: req.query.storeID ? parseInt(req.query.storeID as string) : undefined,
        customerID: req.query.customerID ? parseInt(req.query.customerID as string) : undefined,
        cashierID: req.query.cashierID ? parseInt(req.query.cashierID as string) : undefined,
        status: req.query.status ? parseInt(req.query.status as string) : undefined,
        minAmount: req.query.minAmount ? parseFloat(req.query.minAmount as string) : undefined,
        maxAmount: req.query.maxAmount ? parseFloat(req.query.maxAmount as string) : undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 20,
      };

      const result = await this.posService.searchTransactions(params);
      res.json(result);
    } catch (error: any) {
      logger.error('Error in searchTransactions:', error);
      next(error);
    }
  };

  /**
   * Get transaction details
   * GET /api/pos/transactions/:storeID/:transactionNumber
   */
  getTransactionDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const storeID = parseInt(req.params.storeID);
      const transactionNumber = parseInt(req.params.transactionNumber);

      if (isNaN(storeID) || isNaN(transactionNumber)) {
        res.status(400).json({ error: 'Invalid storeID or transactionNumber' });
        return;
      }

      const result = await this.posService.getTransactionDetails(storeID, transactionNumber);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Transaction not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      logger.error('Error in getTransactionDetails:', error);
      next(error);
    }
  };

  /**
   * Get items for POS
   * GET /api/pos/items
   */
  getItems = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const search = req.query.search as string | undefined;
      const categoryID = req.query.categoryID ? parseInt(req.query.categoryID as string) : undefined;

      const items = await this.posService.getItems(search, categoryID);
      res.json(items);
    } catch (error: any) {
      logger.error('Error in getItems:', error);
      next(error);
    }
  };

  /**
   * Get item by barcode
   * GET /api/pos/items/code/:code
   */
  getItemByCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const code = req.params.code;
      const item = await this.posService.getItemByCode(code);

      if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }

      res.json(item);
    } catch (error: any) {
      logger.error('Error in getItemByCode:', error);
      next(error);
    }
  };

  /**
   * Get available tenders
   * GET /api/pos/tenders
   */
  getTenders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tenders = await this.posService.getTenders();
      res.json(tenders);
    } catch (error: any) {
      logger.error('Error in getTenders:', error);
      next(error);
    }
  };

  /**
   * Get customer by account number
   * GET /api/pos/customers/account/:accountNumber
   */
  getCustomerByAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const accountNumber = req.params.accountNumber;
      const customer = await this.posService.getCustomerByAccount(accountNumber);

      if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      res.json(customer);
    } catch (error: any) {
      logger.error('Error in getCustomerByAccount:', error);
      next(error);
    }
  };

  /**
   * Search customers
   * GET /api/pos/customers/search
   */
  searchCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const search = req.query.q as string;

      if (!search || search.length < 2) {
        res.status(400).json({ error: 'Search query must be at least 2 characters' });
        return;
      }

      const customers = await this.posService.searchCustomers(search);
      res.json(customers);
    } catch (error: any) {
      logger.error('Error in searchCustomers:', error);
      next(error);
    }
  };
}

