import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sigma Hawk Tua Backend API",
            version: "1.0.0",
            description:
                "API documentation for the Sigma Hawk Tua travel backend project with JWT authentication. All endpoints are prefixed with /api/v1.",
            contact: {
                name: "API Support",
                email: "support@sigmahawktua.com"
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8080}/api/v1`,
                description: "Development server",
            },
            {
                url: "https://sigma-hawk-tua-backend-dev-1097710273935.asia-southeast1.run.app/api/v1",
                description: "Production server",
            },
        ],
        tags: [
            {
                name: "Authentication (v1)",
                description: "User authentication and authorization endpoints (API v1)"
            },
            {
                name: "User (v1)",
                description: "User profile and preferences management (API v1)"
            },
            {
                name: "Group (v1)",
                description: "Travel group creation and management (API v1)"
            },
            {
                name: "Blog (v1)",
                description: "Travel blog search (API v1)"
            },
            {
                name: "Blog (v2)",
                description: "Complete blog management including CRUD, likes, and media upload (API v2)"
            },
            {
                name: "Rating (v1)",
                description: "User rating and review system (API v1)"
            },
            {
                name: "Itinerary (v2)",
                description: "Trip itinerary planning and management (API v2)"
            },
            {
                name: "Group Itinerary (v2)",
                description: "Group itinerary collaboration (API v2)"
            },
            {
                name: "Report (v2)",
                description: "Content reporting and moderation (API v2)"
            },
            {
                name: "Travel (v2)",
                description: "Travel-related features and recommendations (API v2)"
            },
            {
                name: "Health (Global)",
                description: "Server health check endpoints"
            }
        ],
    },
    apis: [
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
