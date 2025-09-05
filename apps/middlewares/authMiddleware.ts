import { AppError } from "@/types/error/AppError";
import { verifyJwt } from "@/utils/jwt";
import { config } from "@/config/config";

import type { Request, Response, NextFunction } from "express";

declare module "express" {
  interface Request {
    user?: {
        user_id: number;
        email: string;
    };
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwt(token, config.ACCESSTOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error: unknown) {
    console.error("JWT verification error:", error);
    throw new AppError("Unauthorized: Invalid token", 401);
  }
}