/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       properties:
 *         rating_id:
 *           type: integer
 *           description: "Unique rating identifier"
 *         rater_id:
 *           type: integer
 *           description: "User ID of the person giving the rating"
 *         rated_user_id:
 *           type: integer
 *           description: "User ID being rated"
 *         friendliness:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *           description: "Friendliness rating (0-5)"
 *         communication:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *           description: "Communication rating (0-5)"
 *         reliability:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *           description: "Reliability rating (0-5)"
 *         overall:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *           description: "Overall average rating (0-5)"
 *         comment:
 *           type: string
 *           description: "Optional comment about the rating"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: "Rating creation timestamp"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: "Last update timestamp"
 *     
 *     RatingSubmitRequest:
 *       type: object
 *       required:
 *         - friendliness
 *         - communication
 *         - reliability
 *       properties:
 *         friendliness:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *           description: "Friendliness rating (0-5)"
 *           example: 4.5
 *         communication:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *           description: "Communication rating (0-5)"
 *           example: 4.0
 *         reliability:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *           description: "Reliability rating (0-5)"
 *           example: 5.0
 *         comment:
 *           type: string
 *           description: "Optional comment about the rating"
 *           example: "Great travel companion!"
 *     
 *     UserRatingSummary:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           description: "User ID"
 *         average_friendliness:
 *           type: number
 *           format: float
 *           description: "Average friendliness rating"
 *         average_communication:
 *           type: number
 *           format: float
 *           description: "Average communication rating"
 *         average_reliability:
 *           type: number
 *           format: float
 *           description: "Average reliability rating"
 *         overall_average:
 *           type: number
 *           format: float
 *           description: "Overall average rating across all categories"
 *         total_ratings:
 *           type: integer
 *           description: "Total number of ratings received"
 *         ratings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Rating'
 *           description: "Individual ratings received"
 */

/**
 * @swagger
 * /api/v1/rating/user/{userId}/rating:
 *   get:
 *     tags:
 *       - Rating (v1)
 *     summary: Get all ratings for a user
 *     description: Retrieve all ratings and rating statistics for a specific user (public endpoint)
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to get ratings for
 *     responses:
 *       200:
 *         description: User ratings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRatingSummary'
 *       400:
 *         description: Invalid user ID
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
 *   
 *   post:
 *     tags:
 *       - Rating
 *     summary: Submit rating for a user
 *     description: Submit or update a rating for a target user. Cannot rate yourself. Rate limited to prevent abuse.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to rate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RatingSubmitRequest'
 *     responses:
 *       201:
 *         description: Rating submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rating'
 *       400:
 *         description: Invalid rating data or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Cannot rate yourself or rate limit exceeded
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
 *       429:
 *         description: Too many rating requests - Rate limit exceeded
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
 *   put:
 *     tags:
 *       - Rating
 *     summary: Update existing rating for a user
 *     description: Update an existing rating you've given to a target user. Cannot rate yourself.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to update rating for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RatingSubmitRequest'
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rating'
 *       400:
 *         description: Invalid rating data or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Cannot rate yourself
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User or existing rating not found
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
 *   delete:
 *     tags:
 *       - Rating
 *     summary: Delete your rating for a user
 *     description: Delete a rating you've previously given to a target user. Cannot delete ratings for yourself.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to delete rating for
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Cannot delete ratings for yourself
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User or rating not found
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
