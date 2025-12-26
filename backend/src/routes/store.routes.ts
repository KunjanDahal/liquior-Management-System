import express from 'express';
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  getRegistersByStoreId,
} from '../controllers/store.controller';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// All store routes require authentication
router.use(authenticateJWT);

// Store CRUD routes
router.get('/', getAllStores);
router.get('/:id', getStoreById);
router.post('/', createStore);
router.put('/:id', updateStore);

// Register routes (nested under stores)
router.get('/:storeId/registers', getRegistersByStoreId);

export default router;

