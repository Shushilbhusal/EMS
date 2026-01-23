// role based authorization middleware
import type { Request, Response, NextFunction } from "express";
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;
        if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({ error: "Forbidden" });
        }
        next();
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    };
};