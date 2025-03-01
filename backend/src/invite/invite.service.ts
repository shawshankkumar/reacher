import { PrismaClient } from '@prisma/client';
import { CreateInviteRequest, CreateInviteResponse, GetInviteResponse } from './invite.model';
import { generateId, ID_PREFIXES } from '../utils/id';
import crypto from 'crypto';
import { config } from '../config';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Creates a user profile and generates an invite link
 * @param data The request data containing session ID and username
 * @returns The created invite data
 */
export async function createInvite(data: CreateInviteRequest): Promise<CreateInviteResponse> {
  try {
    // Get session (already validated by middleware)
    const session = await prisma.session.findUnique({
      where: { id: data.session_id },
    });

    if (!session) {
      throw { statusCode: 500, message: 'Session not found after middleware validation' };
    }

    // Check if username is already taken
    if (session.username) {
      throw { statusCode: 400, message: 'Session already has a username' };
    }

    // Check if username is already taken by another session
    const existingUsername = await prisma.session.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      throw { statusCode: 409, message: 'Username already taken' };
    }

    // Generate gravatar image link using session ID hash
    const hash = crypto.createHash('md5').update(data.session_id).digest('hex');
    const imageLink = `https://gravatar.com/avatar/${hash}?d=identicon`;

    // Generate invite ID
    const inviteId = generateId(ID_PREFIXES.INVITE);

    // Update session with username and image link
    const updatedSession = await prisma.session.update({
      where: { id: data.session_id },
      data: {
        username: data.username,
        image_link: imageLink,
      },
    });

    // Create invite record
    const invite = await prisma.invite.create({
      data: {
        id: inviteId,
        session_id: data.session_id,
      },
    });

    // Generate invite link
    const inviteLink = `https://reacher.app/invite/${invite.id}`;

    return {
      username: updatedSession.username!,
      points: updatedSession.points,
      image_link: updatedSession.image_link!,
      invite_id: invite.id,
      invite_link: inviteLink,
      wa_image_url: 'https://google.com', // Hardcoded as requested
      wa_text: 'welcome!', // Hardcoded as requested
    };
  } catch (error) {
    console.error('Error creating invite:', error);
    throw error;
  }
}

/**
 * Gets invite information by invite ID
 * @param inviteId The invite ID
 * @returns The invite information
 */
export async function getInvite(inviteId: string): Promise<GetInviteResponse> {
  try {
    // Get invite with session information
    const invite = await prisma.invite.findUnique({
      where: { id: inviteId },
      include: {
        session: true,
      },
    });

    if (!invite) {
      throw { statusCode: 404, message: 'Invite not found' };
    }

    if (!invite.session.username || !invite.session.image_link) {
      throw { statusCode: 400, message: 'Invite session has no user profile' };
    }

    return {
      username: invite.session.username,
      points: invite.session.points,
      image_link: invite.session.image_link,
    };
  } catch (error) {
    console.error('Error getting invite:', error);
    throw error;
  }
}
