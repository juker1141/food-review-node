import { Response } from "express";
import { Prisma } from "@prisma/client";
import { PrismaError } from "prisma-error-enum";

// 500
export const internalError = "Internal Server Error.";

// 401
export const authError = "Authentication failed";

// 403
export const authForbiddenError = "Authentication forbidden";

// 404
export const notFoundError = "Not found";

export enum Errors {
  INTERNAL_ERROR = "Internal Server Error",
  AUTH_ERROR = "Authentication failed",
  AUTH_FORBIDDEN_ERROR = "Authentication forbidden",
  NOT_FOUND_ERROR = "Not found",
  UNIQUE_ERROR = "Already exists",
  INVALID_FOREIGN_ERROR = "Invalid data format",
}

interface PrismaErrorMeta {
  target: string[];
}

export function handlePrismaError(res: Response, error: any): Response {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const meta = error.meta as unknown as PrismaErrorMeta;
    if (error.code === PrismaError.UniqueConstraintViolation) {
      return res.status(409).json({
        errors: {
          message: `${meta.target.join(", ")} already exists`,
        },
      });
    } else if (error.code === PrismaError.RecordDoesNotExist) {
      return res.status(404).json({
        errors: {
          message: `${meta.target.join(", ")} not found`,
        },
      });
    }
  }

  return res.status(500).json({ errors: internalError });
}
