import { Router } from "express";
import { AuthRouter } from "./authRouter";
import { UserRouter } from "./userRouter";
import { GroupRouter } from "./groupRouter";
import { InterestRouter } from "./interestRouter";

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
        const interestRouter = new InterestRouter();
        this.router.use("/user", userRouter.getRouter());
        this.router.use("/auth", authRouter.getRouter());
        this.router.use("/group", groupRouter.getRouter());
        this.router.use("/interest", interestRouter.getRouter());
    }

    public getRouter(): Router {
        return this.router;
    }
}
