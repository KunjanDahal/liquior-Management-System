import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

export interface JWTPayload {
  userId: number;
  username: string;
  timestamp?: number;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

/**
 * JWT Authentication Middleware
 */
export const authenticateJWT = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError('JWT secret not configured', 500);
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (payload: JWTPayload): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  
  if (!jwtSecret) {
    throw new AppError('JWT secret not configured', 500);
  }

  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn } as jwt.SignOptions);
};

/**
 * Optional authentication - allows both authenticated and unauthenticated requests
 */
export const optionalAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const jwtSecret = process.env.JWT_SECRET;
      
      if (jwtSecret) {
        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
        req.user = decoded;
      }
    } catch (error) {
      // Ignore auth errors for optional auth
    }
  }
  
  next();
};

