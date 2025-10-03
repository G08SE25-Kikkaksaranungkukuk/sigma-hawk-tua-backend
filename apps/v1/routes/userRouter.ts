import { Router } from "express";
import { UserController } from "@/v1/controllers/user/userController";
import { BaseRouter } from "@/utils/baseRouter";
import multer from "multer";

const upload = multer({ dest: "uploads/", storage: multer.memoryStorage() });
import { userMiddleware } from "@/v1/middlewares/userMiddleware";

export class UserRouter extends BaseRouter {
    private controller: UserController;

    constructor() {
        super();
        this.controller = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Define routes for user profile
        this.router.post("/", this.controller.getUser.bind(this.controller)); //get user profile
        this.router.patch(
            "/",
            this.controller.updateUser.bind(this.controller)
        );

        this.router.get(
            "/interests/all",
            this.controller.getAllInterests.bind(this.controller)
        );

        this.router.get(
            "/travel-styles/all",
            this.controller.getAllTravelStyles.bind(this.controller)
        );

        this.router.post(
            "/delete",
            userMiddleware,
            this.controller.deleteUser.bind(this.controller)
        );
        // Define routes for user interests
        this.router.get(
            "/interests",
            this.controller.getInterests.bind(this.controller)
        );
        this.router.patch(
            "/interests",
            this.controller.patchInterests.bind(this.controller)
        );

        // Define routes for user travel styles
        this.router.get(
            "/travel-styles",
            this.controller.getTravelStyles.bind(this.controller)
        );
        this.router.patch(
            "/travel-styles",
            this.controller.patchTravelStyles.bind(this.controller)
        );

        this.router.post(
            "/profile_pic",
            upload.single("profile"),
            this.controller.uploadUserProfile.bind(this.controller)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}
