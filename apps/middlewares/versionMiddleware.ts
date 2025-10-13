import { Request, Response, NextFunction } from "express";
import { ApiVersionManager, DEFAULT_API_VERSION } from "@/config/apiVersion";

declare global {
    namespace Express {
        interface Request {
            apiVersion?: string;
        }
    }
}

export interface VersionMiddlewareOptions {
    defaultVersion?: string;
    strictVersioning?: boolean;
    versionHeader?: string;
}

export const createVersionMiddleware = (options: VersionMiddlewareOptions = {}) => {
    const {
        defaultVersion = DEFAULT_API_VERSION,
        strictVersioning = false,
        versionHeader = "API-Version"
    } = options;

    return (req: Request, res: Response, next: NextFunction) => {
        let version: string | null = null;

        // 1. Extract from URL path (highest priority)
        version = ApiVersionManager.extractVersionFromPath(req.path);

        // 2. Check custom header
        if (!version && req.headers[versionHeader.toLowerCase()]) {
            const headerVersion = req.headers[versionHeader.toLowerCase()] as string;
            if (ApiVersionManager.isVersionSupported(headerVersion)) {
                version = headerVersion;
            }
        }

        // 3. Check Accept header with vendor media type
        if (!version && req.headers.accept) {
            const acceptHeader = req.headers.accept;
            const versionMatch = acceptHeader.match(/application\/vnd\.thamroi\+json;version=(\w+)/);
            if (versionMatch && ApiVersionManager.isVersionSupported(versionMatch[1])) {
                version = versionMatch[1];
            }
        }

        // 4. Fallback to default
        if (!version) {
            version = defaultVersion;
        }

        // Validate version support
        if (!ApiVersionManager.isVersionSupported(version)) {
            if (strictVersioning) {
                return res.status(400).json({
                    error: "UnsupportedApiVersion",
                    message: `API version '${version}' is not supported`,
                    supportedVersions: ApiVersionManager.getSupportedVersions(),
                    timestamp: new Date().toISOString()
                });
            } else {
                // Fallback to default version
                version = defaultVersion;
            }
        }

        // Set version context
        req.apiVersion = version;

        // Set response headers
        res.setHeader("API-Version", version);
        res.setHeader("Supported-Versions", ApiVersionManager.getSupportedVersions().join(", "));

        // Handle deprecation warnings
        const versionConfig = ApiVersionManager.getVersionConfig(version);
        if (versionConfig?.deprecatedAt && new Date() > versionConfig.deprecatedAt) {
            res.setHeader("Deprecation", versionConfig.deprecatedAt.toISOString());
            if (versionConfig.sunsetAt) {
                res.setHeader("Sunset", versionConfig.sunsetAt.toISOString());
            }
        }

        next();
    };
};

// Pre-configured middleware instances
export const versionMiddleware = createVersionMiddleware();

export const strictVersionMiddleware = createVersionMiddleware({
    strictVersioning: true
});