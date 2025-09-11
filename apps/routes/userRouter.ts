import { Router } from "express";
import { UserController } from "@/controllers/user/userController";
import { BaseRouter } from "./baseRouter";
import multer from "multer";

const upload = multer({ dest: 'uploads/' , storage : multer.memoryStorage()})

export class UserRouter extends BaseRouter {
    private controller: UserController;

    constructor() {
        super();
        this.controller = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Define routes for user profile
        this.router.get("/", this.controller.getUser.bind(this.controller));
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
        )
    }

    public getRouter(): Router {
        return this.router;
    }
}
