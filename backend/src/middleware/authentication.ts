import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type Role = "ADMIN" | "USER";

interface JwtPayload {
  id: number;
  email: string;
  role?: Role;
}

import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role?: Role;
      };
    }
  }
}

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token || req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      ...(decoded.role && { role: decoded.role }),
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
