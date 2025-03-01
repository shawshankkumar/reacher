import { validateRequest } from '../validator';
import { ERRORS } from '../errors';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

describe('Validator Utils', () => {
  describe('validateRequest', () => {
    // Mock Express request, response, and next function
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.MockedFunction<NextFunction>;
    
    // Define a test schema
    const testSchema = z.object({
      name: z.string().min(3),
      age: z.number().int().positive(),
      email: z.string().email().optional(),
    });

    beforeEach(() => {
      // Reset mocks before each test
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn() as jest.MockedFunction<NextFunction>;
    });

    it('should call next() when validation succeeds for body', async () => {
      // Setup
      req.body = {
        name: 'John Doe',
        age: 30,
        email: 'john@example.com',
      };
      
      const middleware = validateRequest('body', testSchema);
      
      // Execute
      await middleware(req as Request, res as Response, next);
      
      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
      expect(req.body).toEqual({
        name: 'John Doe',
        age: 30,
        email: 'john@example.com',
      });
    });

    it('should call next() when validation succeeds for query', async () => {
      // Setup
      req.query = {
        name: 'John Doe',
        age: '30', // Query params are strings
        email: 'john@example.com',
      };
      
      // Create a schema that handles string conversion for query params
      const querySchema = z.object({
        name: z.string().min(3),
        age: z.string().transform(val => parseInt(val, 10)),
        email: z.string().email().optional(),
      });
      
      const middleware = validateRequest('query', querySchema);
      
      // Execute
      await middleware(req as Request, res as Response, next);
      
      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    it('should call next() when validation succeeds for params', async () => {
      // Setup
      req.params = {
        name: 'John Doe',
        age: '30', // Params are strings
      };
      
      // Create a schema for params
      const paramsSchema = z.object({
        name: z.string().min(3),
        age: z.string(),
      });
      
      const middleware = validateRequest('params', paramsSchema);
      
      // Execute
      await middleware(req as Request, res as Response, next);
      
      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    it('should call next() with error when required field is missing', async () => {
      // Setup
      req.body = {
        // name is missing
        age: 30,
      };
      
      const middleware = validateRequest('body', testSchema);
      
      // Execute
      await middleware(req as Request, res as Response, next);
      
      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith({
        statusCode: ERRORS.MALFORMED_BODY.code,
        message: ERRORS.MALFORMED_BODY.message.error,
        description: 'Missing required params: name',
        detailedMessage: expect.stringContaining('name: Required'),
      });
    });

    it('should call next() with error when multiple required fields are missing', async () => {
      // Setup
      req.body = {
        // name and age are missing
        email: 'john@example.com',
      };
      
      // Create a schema with multiple required fields
      const requiredSchema = z.object({
        name: z.string(),
        age: z.number(),
        email: z.string().email(),
      });
      
      const middleware = validateRequest('body', requiredSchema);
      
      // Execute
      await middleware(req as Request, res as Response, next);
      
      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0] as any;
      expect(error).toMatchObject({
        statusCode: ERRORS.MALFORMED_BODY.code,
        message: ERRORS.MALFORMED_BODY.message.error,
        description: expect.stringContaining('Missing required params:'),
      });
      // Check that both missing fields are mentioned
      expect(error.description).toContain('name');
      expect(error.description).toContain('age');
    });

    it('should call next() with error when field is invalid', async () => {
      // Setup
      req.body = {
        name: 'Jo', // Too short (min 3)
        age: 30,
      };
      
      const middleware = validateRequest('body', testSchema);
      
      // Execute
      await middleware(req as Request, res as Response, next);
      
      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0] as any;
      expect(error).toMatchObject({
        statusCode: ERRORS.MALFORMED_BODY.code,
        message: ERRORS.MALFORMED_BODY.message.error,
        description: 'Malformed body passed',
        detailedMessage: expect.stringContaining('name: String must contain at least 3 character(s)'),
      });
    });

    it('should call next() with error when field has invalid type', async () => {
      // Setup
      req.body = {
        name: 'John Doe',
        age: 'thirty' as any, // Should be a number
      };
      
      const middleware = validateRequest('body', testSchema);
      
      // Execute
      await middleware(req as Request, res as Response, next);
      
      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0] as any;
      expect(error).toMatchObject({
        statusCode: ERRORS.MALFORMED_BODY.code,
        message: ERRORS.MALFORMED_BODY.message.error,
        description: 'Malformed body passed',
      });
      expect(error.detailedMessage).toContain('age');
      expect(error.detailedMessage).toContain('Expected number');
    });

    it('should call next() with error when email is invalid', async () => {
      // Setup
      req.body = {
        name: 'John Doe',
        age: 30,
        email: 'not-an-email', // Invalid email format
      };
      
      const middleware = validateRequest('body', testSchema);
      
      // Execute
      await middleware(req as Request, res as Response, next);
      
      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0] as any;
      expect(error).toMatchObject({
        statusCode: ERRORS.MALFORMED_BODY.code,
        message: ERRORS.MALFORMED_BODY.message.error,
        description: 'Invalid email provided',
      });
      expect(error.detailedMessage).toContain('email');
      expect(error.detailedMessage).toContain('Invalid email');
    });

    it('should call next() with default error for other validation errors', async () => {
      // Setup
      req.body = {
        name: 123 as any, // Should be a string but we'll mock a different error
        age: 30,
      };
      
      // Mock Zod parseAsync to throw a custom error
      const mockSchema = {
        parseAsync: jest.fn().mockRejectedValue({
          errors: [
            { 
              message: 'Some other error', 
              path: ['name'] 
            }
          ]
        })
      };
      
      const middleware = validateRequest('body', mockSchema as unknown as z.AnyZodObject);
      
      // Execute
      await middleware(req as Request, res as Response, next);
      
      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0] as any;
      expect(error).toMatchObject({
        statusCode: ERRORS.MALFORMED_BODY.code,
        message: ERRORS.MALFORMED_BODY.message.error,
        description: ERRORS.MALFORMED_BODY.message.error_description,
      });
      expect(error.detailedMessage).toContain('name: Some other error');
    });

    it('should handle multiple validation errors in detailedMessage', async () => {
      // Setup
      req.body = {
        name: 'Jo', // Too short
        age: -5,    // Should be positive
        email: 'invalid-email', // Invalid email
      };
      
      const middleware = validateRequest('body', testSchema);
      
      // Execute
      await middleware(req as Request, res as Response, next);
      
      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      
      // We expect the first error to be used for the description
      const error = next.mock.calls[0][0] as any;
      // Check description matches expected format
      expect(error.description).toEqual('Malformed body passed');
      
      // But all errors should be in the detailedMessage
      const detailedMessage = error.detailedMessage;
      expect(detailedMessage).toContain('name');
      expect(detailedMessage).toContain('age');
      expect(detailedMessage).toContain('email');
    });
  });
});
