import { ulid } from 'ulid';

/**
 * Generates a unique identifier with a specified prefix
 * Uses ULID (Universally Unique Lexicographically Sortable Identifier)
 * 
 * @param prefix - The prefix to add to the generated ID
 * @returns A string in the format "{prefix}_{ulid}"
 */
export function generateId(prefix: string): string {
  return `${prefix}_${ulid(+new Date())}`;
}

/**
 * Common ID prefixes used in the application
 */
export const ID_PREFIXES = {
  SESSION: 'sess',
  INVITE: 'invi',
  USER: 'user',
  CITY: 'city',
};
