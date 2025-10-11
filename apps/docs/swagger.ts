import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express, Request, Response } from "express";
import { swaggerSpecV1 } from "./versions/v1.swagger";
import { DocumentationVersionManager } from "./versions/documentationManager";
import { ApiVersionManager } from "@/config/apiVersion";

// Register version specifications
DocumentationVersionManager.registerVersion("v1", swaggerSpecV1);

// Legacy default swagger spec (points to latest version)
const defaultSwaggerSpec = swaggerSpecV1;

export const setupSwagger = (app: Express) => {
    // Documentation version discovery endpoint (JSON)
    app.get("/api-docs", (req: Request, res: Response) => {
        const versionIndex = DocumentationVersionManager.generateVersionIndex();
        res.json({
            success: true,
            message: "API documentation versions available",
            data: versionIndex,
            timestamp: new Date().toISOString()
        });
    });

    // Documentation version discovery as HTML
    app.get("/api-docs/versions", (req: Request, res: Response) => {
        const versions = DocumentationVersionManager.getAvailableVersions();
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>ThamRoi API Documentation Versions</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .version-card { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .version-card.active { border-color: #4CAF50; background-color: #f9fff9; }
        .version-title { font-size: 1.2em; font-weight: bold; margin-bottom: 5px; }
        .version-link { color: #2196F3; text-decoration: none; }
        .version-link:hover { text-decoration: underline; }
        .badge { padding: 2px 8px; border-radius: 3px; font-size: 0.8em; }
        .badge.active { background-color: #4CAF50; color: white; }
        .badge.deprecated { background-color: #ff9800; color: white; }
    </style>
</head>
<body>
    <h1>🚀 ThamRoi API Documentation</h1>
    <p>Choose an API version to view its documentation:</p>
    
    ${versions.map(v => `
        <div class="version-card ${v.isActive ? 'active' : ''}">
            <div class="version-title">
                ${v.title}
                <span class="badge ${v.isActive ? 'active' : 'deprecated'}">
                    ${v.isActive ? 'Active' : 'Deprecated'}
                </span>
            </div>
            <p>${v.description}</p>
            <a href="${v.path}" class="version-link">📖 View Documentation</a>
        </div>
    `).join('')}
    
    <hr>
    <h3>🔗 Quick Links</h3>
    <ul>
        <li><a href="/api/versions">API Version Discovery</a></li>
        <li><a href="/healthz">Health Check</a></li>
        <li><a href="/api-docs/latest">Latest Documentation</a></li>
    </ul>
</body>
</html>`;
        res.send(html);
    });

    // Latest version documentation (default)
    app.use(
        "/api-docs/latest",
        swaggerUi.serve,
        swaggerUi.setup(defaultSwaggerSpec, {
            customCss: ".swagger-ui .topbar { display: none }",
            customSiteTitle: "ThamRoi API Documentation (Latest)",
            swaggerOptions: {
                persistAuthorization: true,
                displayRequestDuration: true,
                docExpansion: "none",
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
            },
        })
    );

    // Version-specific documentation
    app.use("/api-docs/:version", (req: Request, res: Response, next) => {
        const version = req.params.version;
        const spec = DocumentationVersionManager.getVersionSpec(version);
        
        if (!spec) {
            return res.status(404).json({
                success: false,
                message: `Documentation for version '${version}' not found`,
                error: "DOCUMENTATION_VERSION_NOT_FOUND",
                available_versions: ApiVersionManager.getSupportedVersions(),
                timestamp: new Date().toISOString()
            });
        }

        // Create a new router for this specific version
        const versionRouter = swaggerUi.setup(spec, {
            customCss: ".swagger-ui .topbar { display: none }",
            customSiteTitle: `ThamRoi API Documentation (${version.toUpperCase()})`,
            swaggerOptions: {
                persistAuthorization: true,
                displayRequestDuration: true,
                docExpansion: "none",
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
            },
        });

        versionRouter(req, res, next);
    });

    // Raw swagger JSON for each version
    app.get("/api-docs/:version/swagger.json", (req: Request, res: Response) => {
        const version = req.params.version;
        const spec = DocumentationVersionManager.getVersionSpec(version);
        
        if (!spec) {
            return res.status(404).json({
                success: false,
                message: `Swagger specification for version '${version}' not found`,
                error: "SWAGGER_SPEC_NOT_FOUND",
                available_versions: ApiVersionManager.getSupportedVersions(),
                timestamp: new Date().toISOString()
            });
        }

        res.json(spec);
    });

    // Fallback: redirect root api-docs to versions page
    app.get("/api-docs/", (req: Request, res: Response) => {
        res.redirect("/api-docs/versions");
    });
};
