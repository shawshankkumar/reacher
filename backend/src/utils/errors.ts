export const ERRORS = {
  // General errors
  MALFORMED_BODY: {
    code: 400,
    message: {
      error: 'Bad Request',
      error_description: 'Malformed body passed',
    },
  },
  INTERNAL_SERVER_ERROR: {
    message: 'An internal server error occurred',
    statusCode: 500,
    errorCode: 'INTERNAL_SERVER_ERROR'
  },
  INVALID_REQUEST: {
    message: 'Invalid request parameters',
    statusCode: 400,
    errorCode: 'INVALID_REQUEST'
  },
  RESOURCE_NOT_FOUND: {
    message: 'Resource not found',
    statusCode: 404,
    errorCode: 'RESOURCE_NOT_FOUND'
  },
  
  // Session specific errors
  SESSION_NOT_FOUND: {
    message: 'Session not found',
    statusCode: 404,
    errorCode: 'SESSION_NOT_FOUND'
  },
  SESSION_CREATION_FAILED: {
    message: 'Failed to create session',
    statusCode: 500,
    errorCode: 'SESSION_CREATION_FAILED'
  },
  INACTIVE_SESSION: {
    message: 'Session is inactive',
    statusCode: 403,
    errorCode: 'INACTIVE_SESSION'
  },
  USERNAME_EXISTS: {
    message: 'Username already exists',
    statusCode: 409,
    errorCode: 'USERNAME_EXISTS'
  }
};
