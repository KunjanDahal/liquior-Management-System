import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import * as authController from '../controllers/auth.controller';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/validate
 * @desc    Validate JWT token
 * @access  Private
 */
router.post('/validate', authenticateJWT, authController.validateToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticateJWT, authController.logout);

export default router;

