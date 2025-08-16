import { z } from 'zod';

// Schema for city option in responses
export const cityOptionSchema = z.object({
  city: z.string(),
  country: z.string(),
});

// Type for city option
export type CityOption = z.infer<typeof cityOptionSchema>;

// Schema for clue object from the database
export const clueSchema = z.object({
  value: z.string(),
  difficulty: z.string(),
});

// Type for clue
export type Clue = z.infer<typeof clueSchema>;

// Schema for random clue response
export const randomClueResponseSchema = z.object({
  clue: z.string(),
  city_id: z.string().startsWith('city_'),
  options: z.array(cityOptionSchema),
});

// Type for random clue response
export type RandomClueResponse = z.infer<typeof randomClueResponseSchema>;

// Schema for verify guess request
export const verifyGuessRequestSchema = z.object({
  city_id: z.string().startsWith('city_'),
  guess_city: z.string(),
});

// Type for verify guess request
export type VerifyGuessRequest = z.infer<typeof verifyGuessRequestSchema>;

// Schema for verify guess response
export const verifyGuessResponseSchema = z.object({
  correct: z.boolean(),
  points_gained: z.number().optional(),
  points_lost: z.number().optional(),
  total_points: z.number(),
  city: cityOptionSchema,
  fun_fact: z.string(),
  trivia: z.string(),
});

// Type for verify guess response
export type VerifyGuessResponse = z.infer<typeof verifyGuessResponseSchema>;

// Schema for city entity
export const citySchema = z.object({
  id: z.string().startsWith('city_'),
  city: z.string(),
  country: z.string(),
  clues: z.array(clueSchema),
  fun_fact: z.array(z.string()),
  trivia: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type for city entity
export type City = z.infer<typeof citySchema>;
