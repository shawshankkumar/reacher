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
