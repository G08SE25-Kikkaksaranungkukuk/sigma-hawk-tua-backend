import { Router } from "express";
import { AuthRouterV1 } from "./authRouter";
import { UserRouterV1 } from "./userRouter";
import { GroupRouterV1 } from "./groupRouter";
import { BlogRouterV1 } from "./blogRouter";
import { RatingRouterV1 } from "./RatingRouter";

/**
 * RouterManager v1
 * Orchestrates all route modules for API version 1
 * Following Clean Architecture with proper dependency injection
 */
export class RouterManagerV1 {
    private readonly router: Router;
    private readonly authRouter: AuthRouterV1;
    private readonly userRouter: UserRouterV1;
    private readonly groupRouter: GroupRouterV1;
    private readonly blogRouter: BlogRouterV1;
    private readonly ratingRouter: RatingRouterV1;

    constructor() {
        this.router = Router();
        
        // Initialize route modules
        this.authRouter = new AuthRouterV1();
        this.userRouter = new UserRouterV1();
        this.groupRouter = new GroupRouterV1();
        this.blogRouter = new BlogRouterV1();
        this.ratingRouter = new RatingRouterV1();
        
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Register domain-specific route modules
        this.router.use("/auth", this.authRouter.getRouter());
        this.router.use("/user", this.userRouter.getRouter());
        this.router.use("/group", this.groupRouter.getRouter());
        this.router.use("/blog", this.blogRouter.getRouter());
        this.router.use("/rating", this.ratingRouter.getRouter());
    }

    public getRouter(): Router {
        return this.router;
    }
}