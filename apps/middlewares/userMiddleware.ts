import { AppError } from "@/types/error/AppError";
import { verifyJwt } from "@/utils/jwt";
import { config } from "@/config/config";
import type { Request, Response, NextFunction } from "express";

declare module "express" {
  interface Request {
    user?: {
        user_id: number;
        email: string;
        role: string;
    };
  }
}

export function userMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.accessToken; // 👈 from cookie

  if (!token) {
    throw new AppError("Unauthorized: No token provided", 401);
  }

  try {
    const decoded = verifyJwt(token, config.ACCESSTOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError("Unauthorized: Invalid token", 401);
  }
}
