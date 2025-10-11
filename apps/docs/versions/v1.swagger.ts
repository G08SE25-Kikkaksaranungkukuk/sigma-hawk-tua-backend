import swaggerJSDoc from "swagger-jsdoc";
import { ApiVersionManager } from "@/config/apiVersion";

const v1Config = ApiVersionManager.getVersionConfig("v1");

const swaggerOptionsV1: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ThamRoi Travel API - Version 1",
      version: v1Config?.version || "1.0.0",
      description: `
## ThamRoi Travel Companion API v1.0

${v1Config?.description || "Core travel companion functionality"}

### 🔐 Authentication
This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`

### 📍 Base URL
\`\`\`
${v1Config?.prefix || "/api/v1"}
\`\`\`

### 📖 API Versions
- **Current Version**: v1.0 (Active)
- **Version Discovery**: \`GET /api/versions\`

### 🎯 Core Features
- **User Management**: Registration, authentication, profile management
- **Group Management**: Create and manage travel groups
- **Interest Matching**: Match users based on travel interests
- **Reference Data**: Travel styles and interest categories

### 🔄 Response Format
All responses follow a consistent format:
\`\`\`json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-10-11T13:00:00Z"
}
\`\`\`

### ⚠️ Error Handling
Error responses include:
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "timestamp": "2025-10-11T13:00:00Z"
}
\`\`\`
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
        User: {
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
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          }
        },
        Group: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            group_name: { type: "string", example: "Beach Lovers Thailand" },
            group_leader_id: { type: "integer", example: 1 },
            description: { type: "string", example: "กลุ่มสำหรับคนรักทะเลและชายหาด" },
            max_members: { type: "integer", example: 8 },
            current_members: { type: "integer", example: 3 },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          }
        },
        Interest: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            interest_key: { type: "string", example: "SEA" },
            interest_name: { type: "string", example: "Sea & Beach" },
            description: { type: "string", example: "Activities related to sea and beach" }
          }
        },
        TravelStyle: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            style_key: { type: "string", example: "BUDGET" },
            style_name: { type: "string", example: "Budget Travel" },
            description: { type: "string", example: "Cost-effective travel options" }
          }
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
            timestamp: { type: "string", format: "date-time" }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error description" },
            error: { type: "string", example: "ERROR_CODE" },
            timestamp: { type: "string", format: "date-time" }
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
        description: "User authentication and authorization endpoints"
      },
      {
        name: "Users",
        description: "User profile management endpoints"
      },
      {
        name: "Groups",
        description: "Travel group management endpoints"
      },
      {
        name: "Reference Data",
        description: "Static reference data endpoints"
      },
      {
        name: "System",
        description: "System health and version endpoints"
      }
    ]
  },
  apis: [
    "./apps/routes/v1/**/*.ts",
    "./apps/controllers/**/*.ts",
    "./apps/types/**/*.ts"
  ]
};

export const swaggerSpecV1 = swaggerJSDoc(swaggerOptionsV1);