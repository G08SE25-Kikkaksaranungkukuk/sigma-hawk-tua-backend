import swaggerJSDoc from "swagger-jsdoc";
import { ApiVersionManager } from "@/config/apiVersion";

// This is a template for future API versions
// Copy this file and modify for v2, v3, etc.

const v2Config = ApiVersionManager.getVersionConfig("v2");

const swaggerOptionsV2: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ThamRoi Travel API - Version 2",
      version: v2Config?.version || "2.0.0",
      description: `
## ThamRoi Travel Companion API v2.0

${v2Config?.description || "Enhanced API with advanced matching algorithms"}

### 🆕 What's New in v2.0
- **Enhanced Matching**: Advanced algorithm for better travel companion matching
- **Real-time Features**: WebSocket support for real-time notifications
- **Advanced Filtering**: More sophisticated search and filter options
- **Analytics**: Travel pattern analysis and recommendations
- **Social Features**: Extended social networking capabilities

### 🔐 Authentication
This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`

### 📍 Base URL
\`\`\`
${v2Config?.prefix || "/api/v2"}
\`\`\`

### 📖 API Versions
- **Current Version**: v2.0 (Active)
- **Previous Version**: v1.0 (Deprecated)
- **Version Discovery**: \`GET /api/versions\`

### 🎯 Enhanced Features
- **Advanced User Matching**: ML-powered companion matching
- **Real-time Messaging**: In-app messaging system
- **Trip Planning**: Collaborative trip planning tools
- **Recommendation Engine**: AI-powered travel recommendations
- **Social Network**: Extended social features and connections

### 🔄 Response Format
All responses follow a consistent format:
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "version": "2.0",
    "timestamp": "2025-10-11T13:00:00Z",
    "request_id": "req_123456"
  }
}
\`\`\`

### ⚠️ Error Handling
Enhanced error responses include:
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "details": { ... },
  "meta": {
    "version": "2.0",
    "timestamp": "2025-10-11T13:00:00Z",
    "request_id": "req_123456"
  }
}
\`\`\`

### 🔄 Migration from v1
For migration guidance from v1 to v2, see [Migration Guide](/api-docs/migration/v1-to-v2)
      `,
      contact: {
        name: "ThamRoi Development Team",
        email: "dev@thamroi.com"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server"
      },
      {
        url: "https://api.thamroi.com",
        description: "Production server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token obtained from login endpoint"
        }
      },
      schemas: {
        // Enhanced schemas for v2
        UserV2: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            first_name: { type: "string", example: "John" },
            middle_name: { type: "string", nullable: true, example: "William" },
            last_name: { type: "string", example: "Doe" },
            birth_date: { type: "string", format: "date-time", example: "1995-05-15T00:00:00.000Z" },
            sex: { type: "string", enum: ["Male", "Female", "Other"], example: "Male" },
            phone: { type: "string", example: "0812345678" },
            email: { type: "string", format: "email", example: "john.doe@example.com" },
            profile_url: { type: "string", nullable: true, example: "https://example.com/profile.jpg" },
            // New in v2
            matching_score: { type: "number", example: 0.85 },
            social_rank: { type: "integer", example: 42 },
            verification_status: { type: "string", enum: ["unverified", "pending", "verified"], example: "verified" },
            preferences: { 
              type: "object",
              properties: {
                notification_settings: { type: "object" },
                privacy_settings: { type: "object" },
                matching_preferences: { type: "object" }
              }
            },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          }
        },
        ApiResponseV2: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
            meta: {
              type: "object",
              properties: {
                version: { type: "string", example: "2.0" },
                timestamp: { type: "string", format: "date-time" },
                request_id: { type: "string", example: "req_123456" }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: "Authentication",
        description: "Enhanced user authentication and authorization endpoints"
      },
      {
        name: "Users",
        description: "Advanced user profile management endpoints"
      },
      {
        name: "Matching",
        description: "AI-powered user matching endpoints"
      },
      {
        name: "Groups",
        description: "Enhanced travel group management endpoints"
      },
      {
        name: "Messaging",
        description: "Real-time messaging endpoints"
      },
      {
        name: "Recommendations",
        description: "AI-powered recommendation endpoints"
      },
      {
        name: "Analytics",
        description: "Travel analytics and insights endpoints"
      },
      {
        name: "System",
        description: "Enhanced system health and version endpoints"
      }
    ]
  },
  apis: [
    // When v2 is implemented, point to v2 routes
    "./apps/routes/v2/**/*.ts",
    "./apps/controllers/v2/**/*.ts",
    "./apps/types/v2/**/*.ts"
  ]
};

// Export for future use when v2 is implemented
export const swaggerSpecV2 = swaggerJSDoc(swaggerOptionsV2);