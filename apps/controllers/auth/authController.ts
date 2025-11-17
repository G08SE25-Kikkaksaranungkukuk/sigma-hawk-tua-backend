import { Request, Response } from "express";
import { AuthService } from "@/services/auth/authService";
import { authRegisterReq } from "@/types/auth/authRequest";
import { BaseController } from "@/controllers/BaseController";
import { AppError } from "@/types/error/AppError";

export class AuthController extends BaseController {
    private authService: AuthService;

    constructor() {
        super();
        this.authService = new AuthService();
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.authService.register(req.body as authRegisterReq);
            this.handleSuccess(res, { user }, 201, "User registered successfully");
        } catch (error) {
            console.error("Error during registration:", error);
            this.handleError(error, res);
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const tokens = await this.authService.login(req.body);

            // Set secure cookies for tokens
            this.setAuthCookies(res, tokens);

            this.handleSuccess(res, tokens, 200, "Login successful");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.authService.forgotPassword(req.body);

            if (result) {
                this.handleSuccess(
                    res,
                    null,
                    200,
                    "Password reset instructions have been sent"
                );
            }
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            // Clear authentication cookies
            this.clearAuthCookies(res);

            this.handleSuccess(res, null, 200, "Logged out successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async refreshTokens(req: Request, res: Response): Promise<void> {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new AppError("Unauthorized: No refresh token provided", 401);
            }

            const refreshToken = authHeader.split(" ")[1];

            const tokens = await this.authService.refreshTokens(refreshToken);

            // Update cookies with new tokens
            this.setAuthCookies(res, tokens);

            this.handleSuccess(res, tokens, 200, "Tokens refreshed successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }
    async whoAmI(req: Request, res: Response): Promise<void> {
        try {
            this.handleSuccess(res, req.user, 200, "Individual Verified");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async checkEmail(req: Request, res: Response): Promise<void> {
        try {
            const email = req.query.email as string;
            if (!email) {
                return this.handleError(new Error("Email is required"), res);
            }
            const exists = await this.authService.isEmailExists(email);
            this.handleSuccess(res, { exists }, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }
}
