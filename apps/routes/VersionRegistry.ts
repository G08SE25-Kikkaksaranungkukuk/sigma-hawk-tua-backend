import { Router } from "express";
import { RouterManagerV1 } from "./v1/RouterManager";
import { ApiVersionManager, API_VERSIONS } from "@/config/apiVersion";

/**
 * Version Registry
 * Central registry for all API versions following Clean Architecture
 * Provides version discovery and routing capabilities
 */
export class VersionRegistry {
    private readonly router: Router;
    private readonly versionRouters: Map<string, Router>;

    constructor() {
        this.router = Router();
        this.versionRouters = new Map();
        this.initializeVersions();
        this.setupVersionEndpoints();
    }

    private initializeVersions(): void {
        // Register v1
        if (API_VERSIONS.v1.isActive) {
            const v1RouterManager = new RouterManagerV1();
            this.versionRouters.set("v1", v1RouterManager.getRouter());
            this.router.use(API_VERSIONS.v1.prefix, v1RouterManager.getRouter());
        }

        // Future versions will be registered here
        // if (API_VERSIONS.v2?.isActive) {
        //     const v2RouterManager = new RouterManagerV2();
        //     this.versionRouters.set("v2", v2RouterManager.getRouter());
        //     this.router.use(API_VERSIONS.v2.prefix, v2RouterManager.getRouter());
        // }
    }

    private setupVersionEndpoints(): void {
        // Version discovery endpoint
        this.router.get("/api/versions", (req, res) => {
            const supportedVersions = ApiVersionManager.getSupportedVersions();
            const versionsInfo = supportedVersions.map(versionKey => ({
                key: versionKey,
                ...API_VERSIONS[versionKey],
                endpoints: this.getVersionEndpoints(versionKey)
            }));

            res.json({
                current: ApiVersionManager.getLatestVersion(),
                default: "v1",
                supported: versionsInfo,
                timestamp: new Date().toISOString()
            });
        });

        // API root redirect
        this.router.get("/api", (req, res) => {
            res.redirect(301, "/api/versions");
        });
    }

    private getVersionEndpoints(version: string): string[] {
        // In a more complex system, this could introspect the router
        // For now, return the known endpoint patterns
        const baseUrl = API_VERSIONS[version]?.prefix || "";
        return [
            `${baseUrl}/auth/*`,
            `${baseUrl}/user/*`, 
            `${baseUrl}/group/*`
        ];
    }

    public getRouter(): Router {
        return this.router;
    }

    public getVersionRouter(version: string): Router | null {
        return this.versionRouters.get(version) || null;
    }

    public getSupportedVersions(): string[] {
        return Array.from(this.versionRouters.keys());
    }
}