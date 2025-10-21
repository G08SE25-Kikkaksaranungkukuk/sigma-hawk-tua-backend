import { AppError } from "@/types/error/AppError";
import { verifyJwt } from "@/utils/jwt";
import { config } from "@/config/config";
import { UserRole } from "@/types/auth/authRequest";

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

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { accessToken } = req.cookies
  let token;
  if (!accessToken) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized: No token provided", 401);
    }
    token = authHeader.split(" ")[1];
  }
  else token = accessToken

  try {
    const decoded = verifyJwt(token, config.ACCESSTOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error: unknown) {
    console.error("JWT verification error:", error);
    throw new AppError("Unauthorized: Invalid token", 401);
  }
}


export function checkRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Unauthorized: No user found", 401);
    }

    if (!req.user.role) {
      throw new AppError("Forbidden: User role not specified", 403);
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      throw new AppError(
        `Forbidden: Required role: ${allowedRoles.join(" or ")}`,
        403
      );
    }

    next();
  };
}