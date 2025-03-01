import express from 'express';
import { PrismaClient } from '@prisma/client';
import sessionController from './session/session.controller';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// API Routes
app.use('/api/v1/session', sessionController);

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
