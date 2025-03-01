import {Router} from 'express';
import type { Request, Response } from 'express';
import { createSession } from './session.service';

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

export default router;
