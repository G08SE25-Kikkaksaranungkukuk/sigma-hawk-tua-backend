import "dotenv/config";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import cookieParser from "cookie-parser";
import { RouterManager } from "@/routes/RouterManager";
import { setupSwagger } from "@/docs/swagger";

const app = express();

// Configure CORS - allow frontend domain
const allowedOrigins = [
    'https://thamroi.duckdns.org',
    'http://localhost:3000',
];

const corsOptions = {
    credentials: true,
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (like mobile apps, Postman, or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(null, false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
};

// Apply CORS globally (this handles both preflight and regular requests)
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());

// Simple request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Proxy route for serving public files from file server
app.get('/public/*', async (req, res) => {
    try {
        const fileServerUrl = process.env.FILE_SERVER_URL || 'https://thamroidufs.duckdns.org';
        const filePath = req.path;
        
        console.log(`[File Proxy] Fetching: ${fileServerUrl}${filePath}`);
        
        const axios = require('axios');
        const response = await axios.get(`${fileServerUrl}${filePath}`, {
            responseType: 'arraybuffer',
            validateStatus: (status: number) => status < 500 // Accept 404s
        });
        
        if (response.status === 404) {
            res.status(404).json({ error: 'File not found' });
            return;
        }
        
        // Forward the content type from file server
        const contentType = response.headers['content-type'] || 'application/octet-stream';
        res.set('Content-Type', contentType);
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
        res.send(Buffer.from(response.data));
    } catch (error: any) {
        console.error(`[File Proxy] Error fetching file:`, error.message);
        res.status(404).json({ error: 'File not found' });
    }
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
app.get("/health", (_req: Request, res: Response) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

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
        
        app.listen(Number(PORT), () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
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
