import { Router } from "express";
import { UserController } from "@/controllers/user/userController";

export class UserRouter {
    private router: Router;
    private controller: UserController;

    constructor() {
        this.router = Router();
        this.controller = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Define routes for user interests
        this.router.get("/interests/:id", this.controller.getInterests);
        this.router.patch("/interests/:id", this.controller.patchInterests);
    }

    public getRouter(): Router {
        return this.router;
    }
}
