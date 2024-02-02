import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { internalError, authError } from "../util/error";

export interface CustomRequest extends Request {
  userId: string | JwtPayload;
}

const authVerifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      errors: authError,
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        errors: internalError,
      });
    }

    const decoded = jwt.verify(token, jwtSecret);
    (req as CustomRequest).userId = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      errors: authError,
    });
  }
};

export default authVerifyToken;
