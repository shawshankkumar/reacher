import { Router } from 'express';
import type { Request, Response } from 'express';
import { createInvite, getInvite } from './invite.service';
import { createInviteRequestSchema, getInviteParamsSchema } from './invite.model';
import { verifySessionMiddleware } from '../utils/session';
import { validateRequest } from '../utils/validator';

const router = Router();

/**
 * @route POST /api/v1/invite/
 * @description Updates the session with user details and generates an invite link
 *
 * @request
 * @body {
 *   session_id: string, // Format: sess_ULID
 *   username: string
 * }
 *
 * @response
 * @status 200 - Invite created successfully
 * @body {
 *   success: boolean,
 *   data: {
 *     username: string,
 *     points: number,
 *     image_link: string,
 *     invite_id: string, // Format: invi_ULID
 *     invite_link: string
 *   }
 * }
 *
 * @error
 * @status 400 - Invalid request body or session already has a username
 * @status 403 - Session is inactive
 * @status 404 - Session not found
 * @status 409 - Username already taken
 * @status 500 - Internal server error
 * @body {
 *   success: false,
 *   message: string
 * }
 */
router.post('/', verifySessionMiddleware, validateRequest('body', createInviteRequestSchema), async (req: Request, res: Response) => {
  try {
    // Session is already verified and attached to the request by the middleware
    const sessionId = req.headers['session-id'] as string;
    
    // No need for manual validation as it's handled by validateRequest middleware
    const inviteData = await createInvite({ session_id: sessionId, username: req.body.username });

    res.status(200).json({
      success: true,
      data: inviteData,
    });
  } catch (error) {
    console.error('Error in create invite endpoint:', error);

    res.status((error as any)?.statusCode || 500).json({
      success: false,
      message: (error as any)?.message || 'Something went wrong',
    });
  }
});

/**
 * @route GET /api/v1/invite/:id
 * @description Returns information about the user who generated the invite
 *
 * @request
 * @params id - The invite ID (Format: invi_ULID)
 *
 * @response
 * @status 200 - Invite information retrieved successfully
 * @body {
 *   success: boolean,
 *   data: {
 *     username: string,
 *     points: number,
 *     image_link: string,
 *     wa_image_url: string,
 *     wa_text: string
 *   }
 * }
 *
 * @error
 * @status 404 - Invite not found
 * @status 400 - Invite session has no user profile
 * @status 500 - Internal server error
 * @body {
 *   success: false,
 *   message: string
 * }
 */
router.get('/:id', validateRequest('params', getInviteParamsSchema), async (req: Request, res: Response) => {
  try {
    // No need for manual validation as it's handled by validateRequest middleware
    const inviteId = req.params.id;
    
    const inviteData = await getInvite(inviteId);

    res.status(200).json({
      success: true,
      data: inviteData,
    });
  } catch (error) {
    console.error('Error in get invite endpoint:', error);

    res.status((error as any)?.statusCode || 500).json({
      success: false,
      message: (error as any)?.message || 'Something went wrong',
    });
  }
});

export default router;
