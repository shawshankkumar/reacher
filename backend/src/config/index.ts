/**
 * Application configuration
 * Centralizes all configuration settings for easier management
 */

// Environment
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

// Server
const PORT = parseInt(process.env.PORT || '3000', 10);
const API_PREFIX = '/api/v1';

// Security
const CORS_WHITELIST = process.env.CORS_WHITELIST ? 
  process.env.CORS_WHITELIST.split(',') : 
  ['http://localhost:3000', 'http://localhost:5173'];

// Rate limiting
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: IS_PRODUCTION ? 100 : 1000, // Limit each IP to 100 requests per window in production, more in development
};

// Session
const SESSION_INITIAL_POINTS = 10;

export default {
  NODE_ENV,
  IS_PRODUCTION,
  PORT,
  API_PREFIX,
  CORS_WHITELIST,
  RATE_LIMIT,
  SESSION_INITIAL_POINTS,
};
