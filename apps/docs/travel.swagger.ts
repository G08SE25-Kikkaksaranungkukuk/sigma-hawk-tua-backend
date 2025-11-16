/**
 * @swagger
 * components:
 *   schemas:
 *     TravelHistoryItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 5
 *         group_id:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         itinerary_id:
 *           type: integer
 *           nullable: true
 *           example: 10
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-27T12:34:56.000Z"
 *         expires_at:
 *           type: string
 *           format: date-time
 *           example: "2026-10-27T12:34:56.000Z"
 *         group:
 *           type: object
 *           nullable: true
 *           description: "Optional group representation"
 *         itinerary:
 *           type: object
 *           nullable: true
 *           description: "Optional itinerary representation"
 *
 *     TravelHistoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         travel_history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TravelHistoryItem'
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/v2/travel/me:
 *   get:
 *     tags:
 *       - Travel (v2)
 *     summary: Get authenticated user's travel history
 *     description: Retrieve travel history entries for the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User travel history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TravelHistoryResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
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
