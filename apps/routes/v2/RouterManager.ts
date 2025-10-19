import { Router } from "express"
import { BlogRouterV2 } from "./blogRouter"
import { ItineraryRouterV2, GroupItineraryRouterV2 } from "./itineraryRouter"
import { ReportRouterV2 } from "./ReportRouter"

/**
 * RouterManager v2
 * Orchestrates all route modules for API version 2
 * Following Clean Architecture with proper dependency injection
 */
export class RouterManagerV2 {
    private readonly router: Router
    private readonly blogRouter: BlogRouterV2
    private readonly itineraryRouter: ItineraryRouterV2
    private readonly groupItineraryRouter: GroupItineraryRouterV2
    private readonly reportRouter: ReportRouterV2

    constructor() {
        this.router = Router()

        // Initialize route modules
        this.blogRouter = new BlogRouterV2()
        this.reportRouter = new ReportRouterV2()
        this.itineraryRouter = new ItineraryRouterV2()
        this.groupItineraryRouter = new GroupItineraryRouterV2()

        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        // Register domain-specific route modules
        this.router.use("/blogs", this.blogRouter.getRouter())
        this.router.use("/itineraries", this.itineraryRouter.getRouter())
        this.router.use("/groups", this.groupItineraryRouter.getRouter())
        this.router.use("/reports", this.reportRouter.getRouter())
    }

    public getRouter(): Router {
        return this.router
    }
}
