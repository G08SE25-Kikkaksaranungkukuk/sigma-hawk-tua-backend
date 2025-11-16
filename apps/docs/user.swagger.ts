/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserRequest:
 *       type: object
 *       properties:
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
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           example: ["TEMPLE", "FESTIVAL"]
 *         travel_styles:
 *           type: array
 *           items:
 *             type: string
 *           example: ["BUDGET"]
 *     
 *     Interest:
 *       type: object
 *       properties:
 *         interest_id:
 *           type: integer
 *           description: "Unique interest identifier"
 *         key:
 *           type: string
 *           description: "Interest key"
 *         name_en:
 *           type: string
 *           description: "Interest name in English"
 *         name_th:
 *           type: string
 *           description: "Interest name in Thai"
 *         description_en:
 *           type: string
 *           description: "Interest description in English"
 *         description_th:
 *           type: string
 *           description: "Interest description in Thai"
 *     
 *     TravelStyle:
 *       type: object
 *       properties:
 *         travel_style_id:
 *           type: integer
 *           description: "Unique travel style identifier"
 *         key:
 *           type: string
 *           description: "Travel style key"
 *         name_en:
 *           type: string
 *           description: "Travel style name in English"
 *         name_th:
 *           type: string
 *           description: "Travel style name in Thai"
 *         description_en:
 *           type: string
 *           description: "Travel style description in English"
 *         description_th:
 *           type: string
 *           description: "Travel style description in Thai"
 */

/**
 * @swagger
 * /api/v1/user/profile_pic:
 *   post:
 *     tags:
 *       - User (v1)
 *     summary: Upload user profile picture
 *     description: Upload or update the profile picture for the current user (requires authentication)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: "Profile picture file (max 5MB)"
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile picture uploaded successfully"
 *                 profile_url:
 *                   type: string
 *                   description: "URL of the uploaded profile picture"
 *       400:
 *         description: Invalid file or file too large (max 5MB)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       413:
 *         description: File too large (exceeds 5MB limit)
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
 * /api/v1/user:
 *   post:
 *     tags:
 *       - User (v1)
 *     summary: Get a user profile
 *     description: Retrieve the profile information of a user
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
 *                 example: "nuttea@example.com"
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 first_name:
 *                   type: string
 *                   example: "nuttea"
 *                 middle_name:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 last_name:
 *                   type: string
 *                   example: "algo"
 *                 birth_date:
 *                   type: string
 *                   format: date-time
 *                   example: "1995-05-15T00:00:00.000Z"
 *                 sex:
 *                   type: string
 *                   example: "male"
 *                 phone:
 *                   type: string
 *                   example: "0812345678"
 *                 profile_url:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 social_credit:
 *                   type: integer
 *                   example: 0
 *                 interests:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["TEMPLE", "FESTIVAL"]
 *                 travel_styles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["BUDGET"]
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
 *   
 *   patch:
 *     tags:
 *       - User (v1)
 *     summary: Update user profile
 *     description: Update the profile information of a user
 *     parameters:
 *       - name: email
 *         in: query
 *         required: true
 *         description: Email of the user to update
 *         schema:
 *           type: string
 *           format: email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - type: object
 *                   properties:
 *                     password:
 *                       type: string
 *                       description: "Hashed password"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * /api/v1/user/interests/all:
 *   get:
 *     tags:
 *       - User (v1)
 *     summary: Get all available interests
 *     description: Retrieve all available interests that users can select
 *     responses:
 *       200:
 *         description: All interests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Interest'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/user/interests:
 *   get:
 *     tags:
 *       - User (v1)
 *     summary: Get user interests
 *     description: Retrieve the interests of a user
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
 *                 description: Email of the user to retrieve interests for
 *     responses:
 *       200:
 *         description: User interests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 interests:
 *                   type: array
 *                   items:
 *                     type: string
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
 *   
 *   patch:
 *     tags:
 *       - User (v1)
 *     summary: Update user interests
 *     description: Update the interests of a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - interests
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the user to update interests for
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: New interests for the user
 *     responses:
 *       200:
 *         description: User interests updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 interests:
 *                   type: array
 *                   items:
 *                     type: string
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
 * /api/v1/user/travel-styles/all:
 *   get:
 *     tags:
 *       - User (v1)
 *     summary: Get all available travel styles
 *     description: Retrieve all available travel styles that users can select
 *     responses:
 *       200:
 *         description: All travel styles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TravelStyle'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/user/travel-styles:
 *   get:
 *     tags:
 *       - User (v1)
 *     summary: Get user travel styles
 *     description: Retrieve the travel styles of a user
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
 *                 description: Email of the user to retrieve travel styles for
 *     responses:
 *       200:
 *         description: User travel styles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 travel_styles:
 *                   type: array
 *                   items:
 *                     type: string
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
 *   
 *   patch:
 *     tags:
 *       - User (v1)
 *     summary: Update user travel styles
 *     description: Update the travel styles of a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - travel_styles
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the user to update travel styles for
 *               travel_styles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: New travel styles for the user
 *     responses:
 *       200:
 *         description: User travel styles updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 travel_styles:
 *                   type: array
 *                   items:
 *                     type: string
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
 * /api/v1/user/delete:
 *   post:
 *     tags:
 *       - User (v1)
 *     summary: Delete user account
 *     description: Delete the current user's account (requires authentication)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
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
