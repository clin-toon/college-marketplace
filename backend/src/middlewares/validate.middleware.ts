import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError, ZodSchema } from "zod";

type ValidationTarget = "body" | "query" | "params";

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

interface FormattedIssue {
  path: string;
  message: string;
}

function formatZodError(error: ZodError): FormattedIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const targets: ValidationTarget[] = ["body", "query", "params"];
    const errors: { target: ValidationTarget; issues: FormattedIssue[] }[] = [];

    for (const target of targets) {
      const schema = schemas[target];
      if (!schema) continue;

      const result = schema.safeParse(req[target]);

      if (!result.success) {
        errors.push({ target, issues: formatZodError(result.error) });
      } else {
        if (target === "body") {
          req.body = result.data;
        } else {
          Object.assign(req[target], result.data);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Request validation failed",
        details: errors,
      });
    }

    next();
  };
}
