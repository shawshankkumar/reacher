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
      //@ts-ignore
      const [firstError] = err.errors;
      if (firstError.message.includes("Required")) {
        //@ts-ignore
        const missingParams = err.errors.map((error) => error.path).join(", ");
        next({
          statusCode: ERRORS.MALFORMED_BODY.code,
          message: ERRORS.MALFORMED_BODY.message.error,
          description: `Missing required params: ${missingParams}`,
        });
      }

      if (firstError.message.includes("Invalid")) {
        //@ts-ignore
        const [first] = err.errors;
        next({
          statusCode: ERRORS.MALFORMED_BODY.code,
          message: ERRORS.MALFORMED_BODY.message.error,
          description: `Invalid ${first.path} provided`,
        });
      }

      next({
        statusCode: ERRORS.MALFORMED_BODY.code,
        message: ERRORS.MALFORMED_BODY.message.error,
        description: ERRORS.MALFORMED_BODY.message.error_description,
      });
    }
  };
}
