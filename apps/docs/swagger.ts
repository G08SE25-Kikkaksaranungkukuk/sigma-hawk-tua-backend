import swaggerUi from "swagger-ui-express";
import rateLimit from "express-rate-limit";
import { Express } from "express";
import path from "path";

// Serve the user's OpenAPI YAML as the source for Swagger UI.
// The YAML file should live at the repository root: `openapi-spec.yml`.
const SPEC_PATH = path.join(process.cwd(), "openapi-spec.yml");

// Rate limiting for the OpenAPI spec endpoint to prevent DoS attacks
const specRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: "Too many requests for OpenAPI spec",
        message: "Please try again later"
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const setupSwagger = (app: Express) => {
    // expose the raw OpenAPI file so swagger-ui can fetch it
    app.get('/openapi-spec.yml', specRateLimit, (req, res) => {
        res.sendFile(SPEC_PATH, (err) => {
            if (err) {
                // if file can't be found/served, return 404
                res.status(404).end();
            }
        });
    });

    // Configure swagger-ui to load the YAML from the above route
    app.use('/api-docs', swaggerUi.serve);
    app.get('/api-docs', swaggerUi.setup(undefined, {
        customSiteTitle: "Sigma Hawk Tua API Documentation",
        swaggerOptions: {
            url: '/openapi-spec.yml',
        },
    }));
};
