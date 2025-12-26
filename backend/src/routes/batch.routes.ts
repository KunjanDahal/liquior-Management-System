import express from 'express';
import {
  getCurrentBatch,
  getBatchById,
  openBatch,
  closeBatch,
  getBatchHistory,
  getAllOpenBatches,
} from '../controllers/batch.controller';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// All batch routes require authentication
router.use(authenticateJWT);

// Batch routes
router.get('/current', getCurrentBatch);
router.get('/open-all', getAllOpenBatches);
router.get('/history', getBatchHistory);
router.get('/:batchNumber', getBatchById);
router.post('/open', openBatch);
router.post('/close', closeBatch);

export default router;



