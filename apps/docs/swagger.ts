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
                url: process.env.NODE_ENV === 'production' 
                    ? 'https://sigma-hawk-tua-backend-prod-1097710273935.asia-southeast1.run.app'
                    : `http://localhost:${process.env.PORT || 8080}`,
                description: process.env.NODE_ENV === 'production' ? "Production server" : "Development server",
            },
        ],
    },
    apis: [
        // Use different paths based on environment
        ...(process.env.NODE_ENV === 'production' 
            ? [
                "./dist/apps/docs/*.js",
                "./dist/apps/routes/**/*.js",
                "./dist/apps/server.js"
              ]
            : [
                "./apps/docs/*.swagger.ts",
                "./apps/routes/**/*.ts",
                "./apps/server.ts"
              ]
        )
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