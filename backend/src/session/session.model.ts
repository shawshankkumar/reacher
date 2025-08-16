import { z } from 'zod';

// Schema for session creation response
export const sessionResponseSchema = z.object({
  session_id: z.string().startsWith('sess_'),
  points: z.number().int().positive(),
});

// Type inference for session response
export type SessionResponse = z.infer<typeof sessionResponseSchema>;

// Schema for session details response
export const sessionDetailsResponseSchema = z.object({
  session_id: z.string().startsWith('sess_'),
  points: z.number().int().positive(),
  username: z.string().nullable().optional(),
  image_link: z.string().nullable().optional(),
  is_active: z.boolean(),
});

// Type inference for session details response
export type SessionDetailsResponse = z.infer<typeof sessionDetailsResponseSchema>;

// Schema for session entity
export const sessionSchema = z.object({
  id: z.string().startsWith('sess_'),
  points: z.number().int().default(10),
  is_active: z.boolean().default(true),
  username: z.string().optional().nullable(),
  image_link: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type inference for session entity
export type Session = z.infer<typeof sessionSchema>;
