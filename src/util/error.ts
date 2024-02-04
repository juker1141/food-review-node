import { Response } from "express";
import { ValidationError } from "sequelize";

// 500
export const internalError = "Internal Error.";

// 401
export const authError = "Authentication failed";

// 403
export const authForbiddenError = "Authentication forbidden";

// 404
export const notFoundError = "Not found";

export function handleSequelizeError(res: Response, error: any): Response {
  if (error instanceof ValidationError) {
    // 驗證錯誤，可能是 email 或 username 不符合條件
    return res
      .status(409)
      .json({ errors: error.errors.map((e: any) => e.message) });
  }
  return res.status(500).json({ errors: internalError });
}
