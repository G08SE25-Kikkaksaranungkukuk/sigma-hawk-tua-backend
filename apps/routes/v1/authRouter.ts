import { AuthController } from "@/controllers/auth/authController";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { BaseRouter } from "../baseRouter";

/**
 * Authentication Router v1
 * Handles user authentication endpoints for API version 1
 * Following Clean Architecture principles with proper separation of concerns
 */
export class AuthRouterV1 extends BaseRouter {
    private readonly authController: AuthController;

    constructor() {
        super({ prefix: "" });
        this.authController = new AuthController();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        // Public authentication endpoints
        this.router.post(
            "/register",
            this.authController.register.bind(this.authController)
        );

        this.router.post(
            "/login",
            this.authController.login.bind(this.authController)
        );

        this.router.post(
            "/refresh",
            this.authController.refreshTokens.bind(this.authController)
        );

        this.router.post(
            "/forgot-password",
            this.authController.forgotPassword.bind(this.authController)
        );

        // Protected authentication endpoints
        this.router.post(
            "/logout",
            authMiddleware,
            this.authController.logout.bind(this.authController)
        );

        this.router.get(
            "/whoami",
            authMiddleware,
            this.authController.whoAmI.bind(this.authController)
        );
        this.router.get(
            "/check-email",
            this.authController.checkEmail.bind(this.authController)
        );
    }
}