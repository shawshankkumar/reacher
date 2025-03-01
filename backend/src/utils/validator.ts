import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { ERRORS } from "./errors";

type RequestLocation = "query" | "body" | "params";

export function validateRequest(
  location: RequestLocation,
  schema: z.AnyZodObject
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req[location] = await schema.parseAsync(req[location]);
      next();
    } catch (err) {
      // Format the error details for better error messages
      //@ts-ignore
      const errorDetails = err.errors.map(error => {
        return `${error.path.join('.')}: ${error.message}`;
      }).join('; ');

      //@ts-ignore
      const [firstError] = err.errors;
      if (firstError.message.includes("Required")) {
        //@ts-ignore
        const missingParams = err.errors.map((error) => error.path).join(", ");
        next({
          statusCode: ERRORS.MALFORMED_BODY.code,
          message: ERRORS.MALFORMED_BODY.message.error,
          description: `Missing required params: ${missingParams}`,
          detailedMessage: errorDetails
        });
        return;
      }

      if (firstError.message.includes("Invalid")) {
        //@ts-ignore
        const [first] = err.errors;
        next({
          statusCode: ERRORS.MALFORMED_BODY.code,
          message: ERRORS.MALFORMED_BODY.message.error,
          description: `Invalid ${first.path} provided`,
          detailedMessage: errorDetails
        });
        return;
      }

      // Default case for other validation errors
      next({
        statusCode: ERRORS.MALFORMED_BODY.code,
        message: ERRORS.MALFORMED_BODY.message.error,
        description: ERRORS.MALFORMED_BODY.message.error_description,
        detailedMessage: errorDetails
      });
    }
  };
}
