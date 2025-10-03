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
 * /user:
 *   post:
 *     tags:
 *       - User
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
 *       - User
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
 * /user/interests/all:
 *   get:
 *     tags:
 *       - User
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
 * /user/travel-styles/all:
 *   get:
 *     tags:
 *       - User
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
 * /user/delete:
 *   post:
 *     tags:
 *       - User
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

/**
 * @swagger
 * /user/interests:
 *   get:
 *     tags:
 *       - User
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
 *       - User
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
