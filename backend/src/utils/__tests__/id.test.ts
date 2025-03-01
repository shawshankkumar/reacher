import { generateId, ID_PREFIXES } from '../id';

describe('ID Generator Utils', () => {
  describe('generateId', () => {
    it('should generate an ID with the specified prefix', () => {
      const prefix = 'test';
      const id = generateId(prefix);
      
      expect(id.startsWith(`${prefix}_`)).toBe(true);
    });

    it('should generate a valid ULID format after prefix', () => {
      const prefix = 'test';
      const id = generateId(prefix);
      
      // Extract the ULID part
      const ulidPart = id.split('_')[1];
      
      // ULID is always 26 characters long
      expect(ulidPart.length).toBe(26);
      
      // ULID should be uppercase alphanumeric
      expect(ulidPart).toMatch(/^[0-9A-Z]{26}$/);
    });

    it('should generate unique IDs', () => {
      const prefix = 'test';
      const ids = new Set();
      
      // Generate 100 IDs and ensure they're all unique
      for (let i = 0; i < 1000; i++) {
        const id = generateId(prefix);
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }
    });

    it('should work with all predefined ID prefixes', () => {
      Object.values(ID_PREFIXES).forEach(prefix => {
        const id = generateId(prefix);
        expect(id.startsWith(`${prefix}_`)).toBe(true);
      });
    });
  });

  describe('ID_PREFIXES', () => {
    it('should have the expected prefix constants', () => {
      expect(ID_PREFIXES).toEqual({
        SESSION: 'sess',
        INVITE: 'invi',
        USER: 'user',
        CITY: 'city',
      });
    });

    it('should generate valid IDs for all predefined prefixes', () => {
      // SESSION prefix
      const sessionId = generateId(ID_PREFIXES.SESSION);
      expect(sessionId.startsWith('sess_')).toBe(true);
      
      // INVITE prefix
      const inviteId = generateId(ID_PREFIXES.INVITE);
      expect(inviteId.startsWith('invi_')).toBe(true);
      
      // USER prefix
      const userId = generateId(ID_PREFIXES.USER);
      expect(userId.startsWith('user_')).toBe(true);
      
      // CITY prefix
      const cityId = generateId(ID_PREFIXES.CITY);
      expect(cityId.startsWith('city_')).toBe(true);
    });
  });

  describe('ULID characteristics', () => {
    it('should have ULIDs that are lexicographically sortable', () => {
      // Wait a short time between generations to ensure timestamp differences
      const generateWithDelay = async () => {
        const prefix = 'test';
        const id1 = generateId(prefix);
        
        // Wait 10ms 
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const id2 = generateId(prefix);
        return { id1, id2 };
      };

      return generateWithDelay().then(({ id1, id2 }) => {
        // Later IDs should sort after earlier IDs
        expect(id1 < id2).toBe(true);
      });
    });
  });
});
