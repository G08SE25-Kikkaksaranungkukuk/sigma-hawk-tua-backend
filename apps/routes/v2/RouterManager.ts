import { Router } from "express";
import { BlogRouterV2 } from "./blogRouter";
import { ReportRouterV2 } from "./ReportRouter";

/**
 * RouterManager v2
 * Orchestrates all route modules for API version 2
 * Following Clean Architecture with proper dependency injection
 */
export class RouterManagerV2 {
    private readonly router: Router;
    private readonly blogRouter : BlogRouterV2;
    private readonly reportRouter : ReportRouterV2;

    constructor() {
        this.router = Router();
        
        // Initialize route modules
        this.blogRouter = new BlogRouterV2();
        this.reportRouter = new ReportRouterV2();
        
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Register domain-specific route modules
        this.router.use("/blogs", this.blogRouter.getRouter());
        this.router.use("/reports", this.reportRouter.getRouter());
    }

    public getRouter(): Router {
        return this.router;
    }
}