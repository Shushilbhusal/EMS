import type { Request, Response, NextFunction } from "express";
import type { AppError } from "../lib/appError.js";
export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

