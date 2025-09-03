import { Router } from "express";
import { UserController } from "@/controllers/user/userController";
import { BaseRouter } from "./baseRouter";

export class UserRouter extends BaseRouter {
    private controller: UserController;

    constructor() {
        super();
        this.controller = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Define routes for user interests
        this.router.get(
            "/interests",
            this.controller.getInterests.bind(this.controller)
        );
        this.router.patch(
            "/interests",
            this.controller.patchInterests.bind(this.controller)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}
