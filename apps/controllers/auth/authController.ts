import { Request, Response } from "express";

import { AppError } from "@/types/error/AppError";
import { AuthService } from "@/services/auth/authService";
import { authRegisterReq } from "@/types/auth/authRequest";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.authService.register(req.body as authRegisterReq);
      res.status(201).json({ user });
      return;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          message: error.message,
        });
        return;
      }

      console.error("Unexpected error:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const tokens = await this.authService.login(req.body);
      
      res.cookie("accessToken", tokens.accessToken, {
        maxAge : 60 * 60 * 24 * 1000 // 24 hours in milliseconds
      })
      res.cookie("refreshToken", tokens.refreshToken, {
          maxAge : 60 * 60 * 24 * 30 * 1000 // 30 days in milliseconds
      })
      
      res.status(200).json(tokens);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          message: error.message,
        });
        return;
      }

      console.error("Unexpected error:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const status = await this.authService.forgotPassword(req.body);
      if (status) {
        res.status(200).json({
          message: "Your password has been reset.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          message: error.message,
        });
        return;
      }

      console.error("Unexpected error:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("accessToken", {});
    res.clearCookie("refreshToken", {});

    res.status(200).json({
      message: "Logged out successfully",
    });
  }

  async refreshTokens(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw new AppError("No refresh token provided", 401);
      }

      const tokens = await this.authService.refreshTokens(refreshToken);
      
      res.cookie("accessToken", tokens.accessToken, {
        maxAge : 60 * 60 * 24 * 1000 // 24 hours in milliseconds
      })
      res.cookie("refreshToken", tokens.refreshToken, {
          maxAge : 60 * 60 * 24 * 30 * 1000 // 30 days in milliseconds
      })
      
      res.status(200).json(tokens);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          message: error.message,
        });
        return;
      }

      console.error("Unexpected error:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}