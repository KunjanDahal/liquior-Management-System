import { Router } from 'express';
import { POSController } from '../controllers/pos.controller';

const router = Router();
const posController = new POSController();

// Transaction routes
router.post('/transactions', posController.createTransaction);
router.get('/transactions', posController.searchTransactions);
router.get('/transactions/:storeID/:transactionNumber', posController.getTransactionDetails);

// Item routes
router.get('/items', posController.getItems);
router.get('/items/code/:code', posController.getItemByCode);

// Tender routes
router.get('/tenders', posController.getTenders);

// Customer routes
router.get('/customers/account/:accountNumber', posController.getCustomerByAccount);
router.get('/customers/search', posController.searchCustomers);

export default router;

