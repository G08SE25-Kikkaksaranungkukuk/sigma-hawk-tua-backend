import { Router } from "express";
import { BlogRouterV2 } from "./blogRouter";

/**
 * RouterManager v1
 * Orchestrates all route modules for API version 1
 * Following Clean Architecture with proper dependency injection
 */
export class RouterManagerV2 {
    private readonly router: Router;
    private readonly blogRouter : BlogRouterV2;

    constructor() {
        this.router = Router();
        
        // Initialize route modules
        this.blogRouter = new BlogRouterV2();
        
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Register domain-specific route modules
        this.router.use("/blogs", this.blogRouter.getRouter());
    }

    public getRouter(): Router {
        return this.router;
    }
}