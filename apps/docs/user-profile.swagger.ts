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
 *       - User
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
