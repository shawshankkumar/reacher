import {Router} from 'express';
import type { Request, Response } from 'express';
import { createSession } from './session.service';

const router = Router();

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
