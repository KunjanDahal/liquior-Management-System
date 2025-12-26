import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerHistory,
} from '../controllers/customer.controller';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// All customer routes require authentication
router.use(authenticateJWT);

// Customer CRUD routes
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

// Customer history
router.get('/:id/history', getCustomerHistory);

export default router;




