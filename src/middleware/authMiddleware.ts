import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { internalError, authError, authForbiddenError } from "../util/error";

export interface CustomRequest extends Request {
  user: JwtPayload;
}

const authVerifyToken = (req: Request, res: Response, next: NextFunction) => {
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
  jwt.verify(token, jwtSecret, function (err: any, decoded: any) {
    if (err) {
      return res.status(403).json({ message: authForbiddenError });
    }

    // 将用户信息附加到请求对象上
    (req as CustomRequest).user = decoded.user;

    next();
  });
};

export default authVerifyToken;
