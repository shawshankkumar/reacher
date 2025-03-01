import { Router } from "express";
import type { Request, Response } from "express";
import { getRandomClue, verifyGuess } from "./city.service";
import { verifyGuessRequestSchema } from "./city.model";

const router = Router();

/**
 * @route GET /api/v1/city/random
 * @description Returns a random clue from any city along with multiple city options
 *
 * @request
 * @header session-id - The session ID to validate user's session
 *
 * @response
 * @status 200 - Random clue retrieved successfully
 * @body {
 *   success: boolean,
 *   data: {
 *     clue: string,
 *     city_id: string, // Format: city_ULID
 *     options: [
 *       {
 *         city: string,
 *         country: string
 *       },
 *       // 3 more city options...
 *     ]
 *   }
 * }
 *
 * @error
 * @status 400 - Missing session ID
 * @status 403 - Session is inactive
 * @status 404 - Session not found
 * @status 500 - Internal server error
 * @body {
 *   success: false,
 *   message: string
 * }
 */
router.get("/random", async (req: Request, res: Response) => {
  try {
    const sessionId = req.headers["session-id"] as string;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        message: "Missing session ID in headers",
      });
      return;
    }

    const clueData = await getRandomClue(sessionId);

    res.status(200).json({
      success: true,
      data: clueData,
    });
  } catch (error) {
    console.error("Error in random clue endpoint:", error);

    res.status((error as any)?.statusCode || 500).json({
      success: false,
      message: (error as any)?.message || "Something went wrong",
    });
  }
});

/**
 * @route POST /api/v1/city/guess/verify
 * @description Validates a user's guess and awards or deducts points
 *
 * @request
 * @header session-id - The session ID to validate user's session
 * @body {
 *   city_id: string, // Format: city_ULID
 *   guess_city: string
 * }
 *
 * @response
 * @status 200 - Guess verification successful
 * @body {
 *   success: boolean,
 *   data: {
 *     correct: boolean,
 *     points_gained?: number, // Only if correct
 *     points_lost?: number, // Only if incorrect
 *     total_points: number,
 *     city: {
 *       city: string,
 *       country: string
 *     },
 *     fun_fact: string,
 *     trivia: string
 *   }
 * }
 *
 * @error
 * @status 400 - Missing session ID or invalid request body
 * @status 403 - Session is inactive
 * @status 404 - Session or city not found
 * @status 500 - Internal server error
 * @body {
 *   success: false,
 *   message: string
 * }
 */
router.post("/guess/verify", async (req: Request, res: Response) => {
  try {
    const sessionId = req.headers["session-id"] as string;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        message: "Missing session ID in headers",
      });
      return;
    }

    // Validate request body
    const parseResult = verifyGuessRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: "Invalid request body",
        errors: parseResult.error.errors,
      });
      return;
    }

    const verificationResult = await verifyGuess(sessionId, parseResult.data);

    res.status(200).json({
      success: true,
      data: verificationResult,
    });
  } catch (error) {
    console.error("Error in verify guess endpoint:", error);

    res.status((error as any)?.statusCode || 500).json({
      success: false,
      message: (error as any)?.message || "Something went wrong",
    });
  }
});

export default router;
