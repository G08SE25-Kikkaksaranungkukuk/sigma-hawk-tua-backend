/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - first_name
 *         - last_name
 *         - phone
 *         - birth_date
 *         - sex
 *         - interests
 *         - travel_styles
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           minLength: 8
 *           example: "SecurePassword123!"
 *           description: "Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&#)"
 *         first_name:
 *           type: string
 *           example: "John"
 *         middle_name:
 *           type: string
 *           example: "William"
 *         last_name:
 *           type: string
 *           example: "Doe"
 *         birth_date:
 *           type: string
 *           format: date
 *           example: "1995-05-15"
 *         sex:
 *           type: string
 *           example: "male"
 *         phone:
 *           type: string
 *           pattern: "^0[0-9]{9}$"
 *           example: "0812345678"
 *           description: "Phone number (10 digits starting with 0)"
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           example: ["TEMPLE", "FESTIVAL", "FOOD"]
 *           minItems: 1
 *           description: "Array of interest keys"
 *         travel_styles:
 *           type: array
 *           items:
 *             type: string
 *           example: ["BUDGET", "LUXURY"]
 *           minItems: 1
 *           description: "Array of travel style keys"
 *     
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "SecurePassword123!"
 *     
 *     AuthTokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: "JWT access token (24h expiry)"
 *         refreshToken:
 *           type: string
 *           description: "JWT refresh token (30d expiry)"
 *     
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           description: "Unique user identifier"
 *         email:
 *           type: string
 *           format: email
 *           description: "User email address"
 *         first_name:
 *           type: string
 *           description: "User first name"
 *         middle_name:
 *           type: string
 *           description: "User middle name"
 *         last_name:
 *           type: string
 *           description: "User last name"
 *         birth_date:
 *           type: string
 *           format: date-time
 *           description: "User birth date"
 *         sex:
 *           type: string
 *           description: "User gender"
 *         phone:
 *           type: string
 *           pattern: "^0[0-9]{9}$"
 *           description: "Phone number (10 digits starting with 0)"
 *         profile_url:
 *           type: string
 *           description: "Profile picture URL"
 *         social_credit:
 *           type: integer
 *           description: "User social credit score"
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           description: "User interests"
 *         travel_styles:
 *           type: array
 *           items:
 *             type: string
 *           description: "User travel styles"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: "Account creation timestamp"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: "Last update timestamp"
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication (v1)
 *     summary: Register a new user
 *     description: Create a new user account with email, password, and profile information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticate user with email and password, returns JWT tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: JWT tokens set as HTTP-only cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Authentication (v1)
 *     summary: Logout user
 *     description: Clear authentication cookies and logout user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication (v1)
 *     summary: Refresh access token
 *     description: Get new access token using refresh token from cookies
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             description: New JWT tokens set as HTTP-only cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthTokens'
 *       401:
 *         description: Invalid or missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication (v1)
 *     summary: Reset password
 *     description: Reset user password (placeholder implementation)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/auth/whoami:
 *   get:
 *     tags:
 *       - Authentication (v1)
 *     summary: Get current user information
 *     description: Get information about the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/auth/email/status:
 *   post:
 *     tags:
 *       - Authentication (v1)
 *     summary: Check if email already exists
 *     description: Check if the provided email is already registered in the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Email status response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     exists:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Email is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */