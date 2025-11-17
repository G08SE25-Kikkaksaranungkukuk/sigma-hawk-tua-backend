import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ThamRoi Backend API",
            version: "1.0.0",
            description:
                "API documentation for the ThamRoi travel backend project with JWT authentication",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8080}`,
                description: "Development server",
            },
        ],
    },
    apis: [
        "./dist/apps/docs/*.js",
        "./dist/apps/routes/*.js",
        "./dist/apps/server.js",
        "./apps/docs/*.swagger.ts",
        "./apps/routes/*.ts",
        "./apps/server.ts"
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customCss: ".swagger-ui .topbar { display: none }",
            customSiteTitle: "Sigma Hawk Tua API Documentation",
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
};
