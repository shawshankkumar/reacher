import { PrismaClient } from "@prisma/client";
import { ulid } from "ulid";
import { SessionResponse } from "./session.model";

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Creates a new session with initial points set to 10
 * @returns Session data with ID and points
 */
export async function createSession(): Promise<SessionResponse> {
  try {
    // Generate a ULID with sess_ prefix for the session ID
    const sessionId = `sess_${ulid()}`;

    // Create a new session in the database
    const session = await prisma.session.create({
      data: {
        id: sessionId,
        points: 10,
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
