import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Helper to generate a JWT token valid for 30 days
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'queueless_fallback_dev_secret_2026';
  return jwt.sign({ id: userId }, secret, { expiresIn: '30d' });
};

// Middleware: Protect private routes by verifying JWT Bearer token
export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header with Bearer token is provided
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token string
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature with secret key
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'queueless_fallback_dev_secret_2026'
      );

      // Find user in MongoDB and attach to req.user (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists or invalid token',
        });
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed verification',
      });
    }
  }

  // If no token was provided at all
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

// Middleware: Optional auth - attaches user if valid token exists, proceeds anyway if not
export const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'queueless_fallback_dev_secret_2026'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      req.user = null;
    }
  }
  next();
};

// Middleware: Role-based authorization guard (e.g. 'staff', 'admin')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};
