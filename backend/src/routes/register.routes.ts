import express from 'express';
import {
  getAllRegisters,
  getRegisterById,
  createRegister,
  updateRegister,
} from '../controllers/store.controller';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// All register routes require authentication
router.use(authenticateJWT);

// Register CRUD routes
router.get('/', getAllRegisters);
router.get('/:id', getRegisterById);
router.post('/', createRegister);
router.put('/:id', updateRegister);

export default router;



