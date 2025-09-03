import { Router } from "express";
import { AuthRouter } from "./authRouter";
import { UserRouter } from "./userRouter";

export class RouterManager {
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeRouters();
    }

    private initializeRouters(): void {
        const authRouter = new AuthRouter();
        const userRouter = new UserRouter();
        this.router.use("/user", userRouter.getRouter());
        this.router.use("/auth", authRouter.getRouter());
    }

    public getRouter(): Router {
        return this.router;
    }
}
