import express from 'express';
import {
  getInventoryValue,
  getLowStockItems,
  getAllItems,
} from '../controllers/inventory.controller';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// All inventory routes require authentication
router.use(authenticateJWT);

// Inventory routes
router.get('/value', getInventoryValue);
router.get('/low-stock', getLowStockItems);
router.get('/items', getAllItems);

export default router;
