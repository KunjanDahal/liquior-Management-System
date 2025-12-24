import express from 'express';
import {
  searchItems,
  getItemById,
  getItemByBarcode,
  searchCustomers,
  getCustomerById,
  getTenders,
  createTransaction,
  getTransactionById,
  getRecentTransactions,
  getCategories,
  getDepartments,
} from '../controllers/pos.controller';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// All POS routes require authentication
router.use(authenticateJWT);

// Item routes
router.get('/items', searchItems);
router.get('/items/barcode/:code', getItemByBarcode);
router.get('/items/:id', getItemById);

// Customer routes
router.get('/customers', searchCustomers);
router.get('/customers/:id', getCustomerById);

// Tender routes
router.get('/tenders', getTenders);

// Category and Department routes
router.get('/categories', getCategories);
router.get('/departments', getDepartments);

// Transaction routes
router.post('/transactions', createTransaction);
router.get('/transactions/:id', getTransactionById);
router.get('/transactions', getRecentTransactions);

export default router;
