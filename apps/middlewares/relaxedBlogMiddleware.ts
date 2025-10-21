import { AppError } from "@/types/error/AppError";
import { verifyJwt } from "@/utils/jwt";
import { config } from "@/config/config";

import type { Request, Response, NextFunction } from "express";
import { numKeys } from "zod/v4/core/util.cjs";

// merging declaration
declare module "express" {
  interface Request {
    user?: {
      user_id: number;
      email: string;
      role: string;
    };
  }
}

export function relaxedBlogMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const { accessToken } = req.cookies

  if (accessToken) { // if accesstoken does exist , calculate the accessToken first
    try {
      const decoded_jwt = verifyJwt(accessToken, config.ACCESSTOKEN_SECRET);
      req.user = decoded_jwt;
      next()
    } catch (error: unknown) {
      req.user = undefined;
    }
  }
  else if (authHeader && authHeader.startsWith("Bearer ")) { // if authorization do exists, calculate the authorization code
    const token = authHeader.split(" ")[1];
    try {
      const decoded = verifyJwt(token, config.ACCESSTOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (error: unknown) {
      req.user = undefined;
    }
  }
  else { // else , unAuthorized
    req.user = undefined;
  }
}