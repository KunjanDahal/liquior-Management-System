import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getConnection } from '../config/database';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

interface LoginRequest {
  username: string;
  password: string;
}

interface CashierRecord {
  ID: number;
  Number: string;
  Name: string;
  Password: string;
  SecurityLevel: number;
  Inactive: boolean;
}

/**
 * Generate JWT token
 */
const generateToken = (userId: number, username: string): string => {
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production';
  
  return jwt.sign(
    { 
      userId, 
      username,
      timestamp: Date.now()
    },
    secret,
    { expiresIn: '24h' }
  );
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: LoginRequest = req.body;

    // Validation
    if (!username || !password) {
      res.status(400).json({
        success: false,
        error: 'Please provide username and password'
      });
      return;
    }

    const pool = await getConnection();
    
    // Query cashier from database - using real RMH database columns
    const result = await pool
      .request()
      .input('username', username)
      .query<CashierRecord>(`
        SELECT 
          ID,
          Number,
          Name,
          Password,
          SecurityLevel,
          ISNULL(Inactive, 0) as Inactive
        FROM Cashier
        WHERE Number = @username
          AND ISNULL(Inactive, 0) = 0
      `);

    if (result.recordset.length === 0) {
      logger.warn(`Failed login attempt for username: ${username}`);
      res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
      return;
    }

    const cashier = result.recordset[0];

    // Check password (RMH stores plain text passwords in the database)
    // Note: In the sample database, passwords are NULL - skip password check for now
    // In production, you should enforce password checks
    if (cashier.Password && cashier.Password.trim() !== '') {
      if (cashier.Password !== password) {
        logger.warn(`Failed login attempt for username: ${username} - incorrect password`);
        res.status(401).json({
          success: false,
          error: 'Invalid username or password'
        });
        return;
      }
    } else {
      // No password set in database - allow login with any password (demo mode)
      logger.info(`Login for ${username} - no password required (NULL in database)`);
    }

    // Generate token
    const token = generateToken(cashier.ID, cashier.Number);

    logger.info(`User logged in successfully: ${username} (ID: ${cashier.ID})`);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: cashier.ID,
          username: cashier.Number,
          name: cashier.Name,
          securityLevel: cashier.SecurityLevel,
          fullName: cashier.Name
        }
      },
      message: 'Login successful'
    });
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during login. Please try again.'
    });
  }
};

/**
 * @desc    Validate JWT token
 * @route   POST /api/auth/validate
 * @access  Private
 */
export const validateToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Token is already validated by middleware
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        valid: true,
        user: {
          id: user.userId,
          username: user.username
        }
      }
    });
  } catch (error: any) {
    logger.error('Token validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Token validation failed'
    });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    if (user) {
      logger.info(`User logged out: ${user.username} (ID: ${user.userId})`);
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error: any) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during logout'
    });
  }
};

