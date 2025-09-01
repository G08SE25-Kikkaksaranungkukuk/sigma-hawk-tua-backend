import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sigma Hawk Tua Backend API',
      version: '1.0.0',
      description: 'API documentation for the Sigma Hawk Tua travel backend project with JWT authentication',
      contact: {
        name: 'API Support',
        email: 'support@sigma-hawk-tua.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'JWT token in cookie',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            user_id: {
              type: 'integer',
              description: 'Unique user identifier',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            firstName: {
              type: 'string',
              description: 'User first name',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
            },
            phone: {
              type: 'string',
              pattern: '^0[0-9]{9}$',
              description: 'Phone number (10 digits starting with 0)',
            },
            interests: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['CULTURE', 'ADVENTURE', 'FOOD', 'RELAXATION', 'NATURE', 'HISTORY', 'ART', 'MUSIC', 'SPORTS', 'SHOPPING'],
              },
              description: 'User interests',
            },
            travel_styles: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['BUDGET'],
              },
              description: 'User travel styles',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName', 'phone', 'interests', 'travel_styles'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              minLength: 8,
              example: 'SecurePassword123!',
              description: 'Password must be at least 8 characters',
            },
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            phone: {
              type: 'string',
              pattern: '^0[0-9]{9}$',
              example: '0812345678',
              description: 'Phone number (10 digits starting with 0)',
            },
            interests: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['CULTURE', 'ADVENTURE', 'FOOD', 'RELAXATION', 'NATURE', 'HISTORY', 'ART', 'MUSIC', 'SPORTS', 'SHOPPING'],
              },
              example: ['CULTURE', 'FOOD', 'ADVENTURE'],
              minItems: 1,
            },
            travel_styles: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['BUDGET'],
              },
              example: ['BUDGET'],
              minItems: 1,
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              example: 'SecurePassword123!',
            },
          },
        },
        AuthTokens: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'JWT access token (24h expiry)',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token (30d expiry)',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
            },
          },
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          description: 'Create a new user account with email, password, and profile information',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RegisterRequest',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Validation error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '409': {
              description: 'Email already exists',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user',
          description: 'Authenticate user with email and password, returns JWT tokens',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login successful',
              headers: {
                'Set-Cookie': {
                  description: 'JWT tokens set as HTTP-only cookies',
                  schema: {
                    type: 'string',
                  },
                },
              },
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AuthTokens',
                  },
                },
              },
            },
            '401': {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Logout user',
          description: 'Clear authentication cookies and logout user',
          security: [
            {
              bearerAuth: [],
            },
            {
              cookieAuth: [],
            },
          ],
          responses: {
            '200': {
              description: 'Logout successful',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SuccessResponse',
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized - Invalid or missing token',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/auth/refresh': {
        post: {
          tags: ['Authentication'],
          summary: 'Refresh access token',
          description: 'Get new access token using refresh token from cookies',
          responses: {
            '200': {
              description: 'Token refreshed successfully',
              headers: {
                'Set-Cookie': {
                  description: 'New JWT tokens set as HTTP-only cookies',
                  schema: {
                    type: 'string',
                  },
                },
              },
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AuthTokens',
                  },
                },
              },
            },
            '401': {
              description: 'Invalid or missing refresh token',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/auth/forgot-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Reset password',
          description: 'Reset user password (placeholder implementation)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'john.doe@example.com',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Password reset successful',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/SuccessResponse',
                  },
                },
              },
            },
            '404': {
              description: 'User not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/healthz': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          description: 'Check if the server is running and healthy',
          responses: {
            '200': {
              description: 'Server is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'healthy',
                      },
                      timestamp: {
                        type: 'string',
                        format: 'date-time',
                      },
                      uptime: {
                        type: 'number',
                        description: 'Server uptime in seconds',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./apps/routes/*.ts', './apps/docs/**/*.yml'], // Updated path to match your structure
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Sigma Hawk Tua API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  }));
  console.log(`📚 Swagger docs available at http://localhost:${process.env.PORT || 8080}/api-docs`);
};