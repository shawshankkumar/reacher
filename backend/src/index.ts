import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
//@ts-ignore
import xssClean from 'xss-clean';
import cookieParser from 'cookie-parser';
import sessionController from './session/session.controller';
import cityController from './city/city.controller';
import inviteController from './invite/invite.controller';
import { requestLogger } from './middleware/logger';
import { config } from './config';

const app = express();
const prisma = new PrismaClient();
const { PORT } = config.server;
const { API_PREFIX } = config.server;
const { RATE_LIMIT } = config.security;
const { CORS_WHITELIST } = config.security;

// Logger middleware
app.use(requestLogger);

// Security middleware
app.use(helmet()); // Adds various HTTP headers for security

// CORS configuration
app.use(cors({
  origin: CORS_WHITELIST.length > 0 ? CORS_WHITELIST : '*', // Use whitelist if available, otherwise allow all
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'session-id'],
  credentials: true // Allow cookies to be sent with requests
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: RATE_LIMIT.windowMs,
  limit: RATE_LIMIT.max,
  standardHeaders: 'draft-7', // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all requests
app.use(limiter);

// Request parsing middleware
app.use(express.json({ limit: '10kb' })); // Parse JSON requests with size limit
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Parse URL-encoded requests

// Cookie parser
app.use(cookieParser());

// Prevent parameter pollution
app.use(hpp());

// Prevent XSS attacks
app.use(xssClean());

// API Routes
app.use(`${API_PREFIX}/session`, sessionController);
app.use(`${API_PREFIX}/city`, cityController);
app.use(`${API_PREFIX}/invite`, inviteController);

// Health check route
app.get('/health', (req, res) => {
  const currentTime = new Date().toISOString();
  const uptime = process.uptime();
  
  res.status(200).json({
    status: 'OK',
    timestamp: currentTime,
    uptime: uptime
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const description = err.description || '';
  const detailedMessage = err.detailedMessage || '';
  
  const response: any = {
    success: false,
    message: statusCode === 500 ? 'Internal server error' : message // Hide detailed error in production
  };
  
  // Add additional error information if available
  if (description) {
    response.description = description;
  }
  
  if (detailedMessage) {
    response.detailedMessage = detailedMessage;
  }
  
  res.status(statusCode).json(response);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
