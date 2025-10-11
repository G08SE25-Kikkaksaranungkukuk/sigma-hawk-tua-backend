import { Router } from "express";
import { VersionRegistry } from "./VersionRegistry";
import { versionMiddleware } from "@/middlewares/versionMiddleware";

/**
 * Main RouterManager
 * Entry point for all API routing following Clean Architecture principles
 * Delegates version-specific routing to VersionRegistry
 */
export class RouterManager {
    private readonly router: Router;
    private readonly versionRegistry: VersionRegistry;

    constructor() {
        this.router = Router();
        this.versionRegistry = new VersionRegistry();
        this.initializeRouters();
    }

    private initializeRouters(): void {
        // Apply version middleware to all /api routes
        this.router.use("/api", versionMiddleware);
        
        // Delegate to version registry
        this.router.use(this.versionRegistry.getRouter());
    }

    public getRouter(): Router {
        return this.router;
    }

    public getVersionRegistry(): VersionRegistry {
        return this.versionRegistry;
    }
}
