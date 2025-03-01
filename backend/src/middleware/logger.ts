import { Request, Response, NextFunction } from 'express';

/**
 * Request logger middleware
 * Logs information about incoming requests
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log when the request is received
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  
  // Once the response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Log the response details
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${statusCode} ${duration}ms`
    );
  });
  
  next();
};
