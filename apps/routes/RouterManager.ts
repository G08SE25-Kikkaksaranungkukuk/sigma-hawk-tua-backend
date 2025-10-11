import { Router, Request, Response } from "express";
import { VersionRegistry } from "./VersionRegistry";
import { versionMiddleware } from "@/middlewares/versionMiddleware";
import { DocumentationVersionManager } from "@/docs/versions/documentationManager";

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
        // Documentation discovery endpoint
        this.router.get("/api/docs", (req: Request, res: Response) => {
            const versions = DocumentationVersionManager.getAvailableVersions();
            res.json({
                success: true,
                message: "Available API documentation versions",
                data: {
                    available_versions: versions,
                    endpoints: {
                        version_discovery: "/api/versions",
                        health_check: "/healthz",
                        swagger_ui: {
                            latest: "/api-docs/latest",
                            versioned: "/api-docs/{version}",
                            list: "/api-docs/versions"
                        },
                        raw_specs: "/api-docs/{version}/swagger.json"
                    }
                },
                timestamp: new Date().toISOString()
            });
        });

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
