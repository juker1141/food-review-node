import { Response } from "express";
import { ValidationError } from "sequelize";

export const internalError = "Internal Error.";

export const authError = "Authentication failed";

export const userNotFoundError = "User not found";

export function handleSequelizeError(res: Response, error: any): Response {
  if (error instanceof ValidationError) {
    // 驗證錯誤，可能是 email 或 username 不符合條件
    return res
      .status(409)
      .json({ errors: error.errors.map((e: any) => e.message) });
  }
  return res.status(500).json({ errors: internalError });
}
