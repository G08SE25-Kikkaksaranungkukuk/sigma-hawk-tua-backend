import { Router } from "express";
import { AuthRouter } from "./authRouter";
import { UserRouter } from "./userRouter";
import { GroupRouter } from "./groupRouter";
import { InterestsRouter } from "./interestsRouter";

export class RouterManager {
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeRouters();
    }

    private initializeRouters(): void {
    const authRouter = new AuthRouter();
    const userRouter = new UserRouter();
    const groupRouter = new GroupRouter();
    const interestsRouter = new InterestsRouter();

    this.router.use("/user", userRouter.getRouter());
    this.router.use("/auth", authRouter.getRouter());
    this.router.use("/group", groupRouter.getRouter());
    this.router.use("/interests", interestsRouter.getRouter());
    }

    public getRouter(): Router {
        return this.router;
    }
}
