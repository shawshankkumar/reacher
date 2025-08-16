import {Router} from 'express';
import type { Request, Response } from 'express';
import { createSession, getSessionById } from './session.service';
import { verifySessionMiddleware } from '../utils/session';

const router = Router();

/**
 * @route POST /api/v1/session
 * @description Creates a new game session with initial points
 * 
 * @request
 * No request body required
 * 
 * @response
 * @status 201 - Session created successfully
 * @body {
 *   success: boolean,
 *   data: {
 *     session_id: string, // Format: sess_ULID
 *     points: number      // Initial points (default: 10)
 *   }
 * }
 * 
 * @error
 * @status 500 - Internal server error
 * @body {
 *   success: false,
 *   message: string
 * }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const sessionData = await createSession();
    
    res.status(201).json({
      success: true,
      data: sessionData
    });
  } catch (error) {
    res.status((error as any)?.statusCode || 500).json({success: false, message: (error as any)?.message});
  }
});

/**
 * @route GET /api/v1/session
 * @description Gets session details by session ID from header
 * 
 * @request
 * @header session-id - Session ID in the request header
 * 
 * @response
 * @status 200 - Session retrieved successfully
 * @body {
 *   success: boolean,
 *   data: {
 *     session_id: string,  // Format: sess_ULID
 *     points: number,      // Current points
 *     username: string|null, // Username if set, null otherwise
 *     image_link: string|null, // Image URL if set, null otherwise
 *     is_active: boolean   // Whether the session is active
 *   }
 * }
 * 
 * @error
 * @status 400 - Missing session ID in headers
 * @status 404 - Session not found
 * @status 403 - Session is inactive
 * @status 500 - Internal server error
 * @body {
 *   success: false,
 *   message: string
 * }
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const sessionId = req.headers['session-id'] as string;
    
    if (!sessionId) {
      res.status(400).json({
        success: false,
        message: 'Missing session ID in headers',
      });
      return;
    }
    
    const sessionData = await getSessionById(sessionId);
    
    res.status(200).json({
      success: true,
      data: sessionData
    });
  } catch (error) {
    res.status((error as any)?.statusCode || 500).json({
      success: false, 
      message: (error as any)?.message
    });
  }
});

export default router;
