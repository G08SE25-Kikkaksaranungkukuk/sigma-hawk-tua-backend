import { Router } from "express";
import { UserController } from "@/controllers/user/userController";
import { BaseRouter } from "../baseRouter";
import { userMiddleware } from "@/middlewares/userMiddleware";
import multer from "multer";

const upload = multer({ 
    dest: "uploads/", 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * User Router v1
 * Handles user management endpoints for API version 1
 * Includes profile management, interests, and travel styles
 */
export class UserRouterV1 extends BaseRouter {
    private readonly userController: UserController;

    constructor() {
        super();
        this.userController = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Profile management
        this.router.post(
            "/",
            this.userController.getUser.bind(this.userController)
        );

        this.router.patch(
            "/",
            this.userController.updateUser.bind(this.userController)
        );

        this.router.post(
            "/delete",
            userMiddleware,
            this.userController.deleteUser.bind(this.userController)
        );

        // Profile picture management
        this.router.post(
            "/profile_pic",
            upload.single("profile"),
            this.userController.uploadUserProfile.bind(this.userController)
        );

        // Interest management
        this.router.get(
            "/interests/all",
            this.userController.getAllInterests.bind(this.userController)
        );

        this.router.get(
            "/interests",
            this.userController.getInterests.bind(this.userController)
        );

        this.router.patch(
            "/interests",
            this.userController.patchInterests.bind(this.userController)
        );

        // Travel style management  
        this.router.get(
            "/travel-styles/all",
            this.userController.getAllTravelStyles.bind(this.userController)
        );

        this.router.get(
            "/travel-styles",
            this.userController.getTravelStyles.bind(this.userController)
        );

        this.router.patch(
            "/travel-styles",
            this.userController.patchTravelStyles.bind(this.userController)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}