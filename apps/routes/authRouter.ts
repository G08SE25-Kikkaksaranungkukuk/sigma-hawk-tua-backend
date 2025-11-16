
import { AuthController } from "@/controllers/auth/authController";
import { authMiddleware } from "@/middlewares/authMiddleware";

import { BaseRouter } from "./baseRouter";

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
    
    this.router.get(
      "/check-email",
      this.authController.checkEmail.bind(this.authController)
    );

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