import { z } from 'zod';

// Schema for create invite request
export const createInviteRequestSchema = z.object({
  username: z.string().min(3).max(30),
});

// Type for create invite request
export type CreateInviteRequest = z.infer<typeof createInviteRequestSchema>;

// Schema for create invite response
export const createInviteResponseSchema = z.object({
  username: z.string(),
  points: z.number(),
  image_link: z.string(),
  invite_id: z.string().startsWith('invi_'),
  invite_link: z.string(),
  wa_image_url: z.string(),
  wa_text: z.string(),
});

// Type for create invite response
export type CreateInviteResponse = z.infer<typeof createInviteResponseSchema>;

// Schema for get invite response
export const getInviteResponseSchema = z.object({
  username: z.string(),
  points: z.number(),
  image_link: z.string(),
});

// Type for get invite response
export type GetInviteResponse = z.infer<typeof getInviteResponseSchema>;

export const getInviteParamsSchema = z.object({
  id: z.string().startsWith('invi_'),
});

export type GetInviteParams = z.infer<typeof getInviteParamsSchema>;
