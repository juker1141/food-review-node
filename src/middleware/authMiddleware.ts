import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { internalError, authError, authForbiddenError } from "../util/error";
import { ResponseUser } from "../controllers/user";

export interface CustomJWTRequest extends Request {
  user?: ResponseUser;
}

const authMiddleware = async (
  req: CustomJWTRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      errors: authError,
    });
  }
  const token = authHeader.split(" ")[1];

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({
      errors: internalError,
    });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (typeof decoded !== "string") {
      req.user = decoded.user;
      next();
    }
  } catch (err: any) {
    return res.status(403).json({ message: authForbiddenError });
  }
};

export default authMiddleware;
