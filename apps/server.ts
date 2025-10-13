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

// Initialize routing with versioning support
const routerManager = new RouterManager();
app.use(routerManager.getRouter());

// Setup Swagger documentation
setupSwagger(app);

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
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

async function startServer() {
    try {
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(
                `� API Documentation: http://localhost:${PORT}/api-docs`
            );
            console.log(`🏥 Health Check: http://localhost:${PORT}/healthz`);
            console.log(
                `�📊 Environment: ${process.env.NODE_ENV || "development"}`
            );
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
