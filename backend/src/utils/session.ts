import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Verifies that a session exists and is active
 * @param sessionId The session ID to verify
 * @returns The session if valid, throws an error otherwise
 */
export async function verifySession(sessionId: string) {
  if (!sessionId) {
    throw { statusCode: 400, message: 'Missing session ID' };
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw { statusCode: 404, message: 'Session not found' };
  }

  if (!session.is_active) {
    throw { statusCode: 403, message: 'Session is inactive' };
  }

  return session;
}

/**
 * Middleware to verify session from headers
 * Expects session-id in the request headers
 */
export function verifySessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.headers['session-id'] as string;

  if (!sessionId) {
    res.status(400).json({
      success: false,
      message: 'Missing session ID in headers',
    });
    return
  }

  verifySession(sessionId)
    .then((session) => {
      // Attach the session to the request object for use in route handlers
      (req as any).session = session;
      next();
    })
    .catch((error) => {
      console.error('Session verification failed:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Session verification failed',
      });
    });
}

/**
 * Middleware to verify session from request body
 * Expects session_id in the request body
 */
export function verifySessionFromBodyMiddleware(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.body.session_id;

  if (!sessionId) {
    return res.status(400).json({
      success: false,
      message: 'Missing session_id in request body',
    });
  }

  verifySession(sessionId)
    .then((session) => {
      // Attach the session to the request object for use in route handlers
      (req as any).session = session;
      next();
    })
    .catch((error) => {
      console.error('Session verification failed:', error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Session verification failed',
      });
    });
}
