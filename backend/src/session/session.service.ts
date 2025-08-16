import { PrismaClient } from "@prisma/client";
import { SessionResponse } from "./session.model";
import { config } from "../config";
import { generateId, ID_PREFIXES } from "../utils/id";

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Creates a new session with initial points set to 10
 * @returns Session data with ID and points
 */
export async function createSession(): Promise<SessionResponse> {
  try {
    // Generate a unique ID for the session
    const sessionId = generateId(ID_PREFIXES.SESSION);

    // Create a new session in the database
    const session = await prisma.session.create({
      data: {
        id: sessionId,
        points: config.session.INITIAL_POINTS,
        is_active: true,
      },
    });

    return {
      session_id: session.id,
      points: session.points,
    };
  } catch (error) {
    console.error("Failed to create session:", error);
    throw { status: 500, message: "Failed to create session" };
  }
}

/**
 * Gets session details by session ID
 * @param sessionId The ID of the session to retrieve
 * @returns Session data including points, username, and image_link
 */
export async function getSessionById(sessionId: string) {
  try {
    // Find the session in the database
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      throw { statusCode: 404, message: "Session not found" };
    }

    if (!session.is_active) {
      throw { statusCode: 403, message: "Session is inactive" };
    }

    return {
      session_id: session.id,
      points: session.points,
      username: session.username,
      image_link: session.image_link,
      is_active: session.is_active,
    };
  } catch (error) {
    console.error("Failed to get session:", error);
    throw { 
      statusCode: (error as any)?.statusCode || 500, 
      message: (error as any)?.message || "Failed to get session" 
    };
  }
}
