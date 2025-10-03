import { AuthController } from "@/v1/controllers/auth/authController";
import { authMiddleware } from "@/v1/middlewares/authMiddleware";

import { BaseRouter } from "@/utils/baseRouter";

export class AuthRouter extends BaseRouter {
    private authController: AuthController;

    constructor() {
        super({
            prefix: "",
        });
        this.authController = new AuthController();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post(
            "/register",
            this.authController.register.bind(this.authController)
        );
        this.router.post(
            "/login",
            this.authController.login.bind(this.authController)
        );
        this.router.post(
            "/forgot-password",
            this.authController.forgotPassword.bind(this.authController)
        );
        this.router.post(
            "/logout",
            authMiddleware,
            this.authController.logout.bind(this.authController)
        );
        this.router.post(
            "/refresh",
            this.authController.refreshTokens.bind(this.authController)
        );
        this.router.get(
            "/whoami",
            authMiddleware,
            this.authController.whoAmI.bind(this.authController)
        );
    }
}
