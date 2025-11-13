import "dotenv/config";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import cookieParser from "cookie-parser";
import { RouterManager } from "@/routes/RouterManager";
import { setupSwagger } from "@/docs/swagger";
import { ApiVersionManager } from "@/config/apiVersion";

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(cookieParser());

// Simple request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

/**
 * @swagger
 * /healthz:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     description: Check if the server is running and healthy
 *     responses:
 *       '200':
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 */
app.get("/healthz", (_req: Request, res: Response) => {
    console.log('✅ /healthz endpoint HIT!');
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

console.log('✅ /healthz route registered');

// Initialize routing with versioning support
try {
    console.log('🔄 Initializing RouterManager...');
    const routerManager = new RouterManager();
    app.use(routerManager.getRouter());
    console.log('✅ RouterManager initialized');
} catch (error) {
    console.error('❌ Failed to initialize RouterManager:', error);
    // Continue anyway so health check still works
}

// Setup Swagger documentation
try {
    console.log('🔄 Setting up Swagger...');
    setupSwagger(app);
    console.log('✅ Swagger initialized');
} catch (error) {
    console.error('❌ Failed to setup Swagger:', error);
}

// Debug: Add a catch-all route to see what's being received
app.use((req, res, next) => {
    console.log(`🔍 Unmatched route: ${req.method} ${req.url} - Original URL: ${req.originalUrl}`);
    console.log(`   Headers:`, JSON.stringify(req.headers));
    next();
});

async function startServer() {
    try {
        const PORT = process.env.PORT || 8080;
        const HOST = '0.0.0.0'; // Listen on all interfaces for Cloud Run
        
        console.log('🔧 Starting server with configuration:');
        console.log(`   - PORT: ${PORT}`);
        console.log(`   - HOST: ${HOST}`);
        console.log(`   - NODE_ENV: ${process.env.NODE_ENV || "development"}`);
        
        app.listen(Number(PORT), HOST, () => {
            console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
            console.log(
                `📚 API Documentation: http://localhost:${PORT}/api-docs`
            );
            console.log(`🏥 Health Check: http://localhost:${PORT}/healthz`);
            console.log(
                `📊 Environment: ${process.env.NODE_ENV || "development"}`
            );
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

startServer();
