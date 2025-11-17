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
    /**
     * @swagger
     * /api/v1/auth/check-email:
     *   get:
     *     tags:
     *       - Authentication
     *     summary: Check if email exists
     *     description: Check if an email address is already registered in the system
     *     parameters:
     *       - in: query
     *         name: email
     *         required: true
     *         schema:
     *           type: string
     *           format: email
     *         description: Email address to check
     *         example: user@example.com
     *     responses:
     *       200:
     *         description: Email check result
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: Email is available
     *                 data:
     *                   type: object
     *                   properties:
     *                     email:
     *                       type: string
     *                       example: user@example.com
     *                     exists:
     *                       type: boolean
     *                       example: false
     *                     available:
     *                       type: boolean
     *                       example: true
     *       400:
     *         description: Missing or invalid email parameter
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: false
     *                 message:
     *                   type: string
     *                   example: Email parameter is required
     */
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