/**
 * @swagger
 * components:
 *   schemas:
 *     Itinerary:
 *       type: object
 *       properties:
 *         itinerary_id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Weekend in Chiang Mai"
 *         description:
 *           type: string
 *           example: "A short trip to explore temples and local markets"
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2026-01-10"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2026-01-12"
 *         place_links:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://maps.example/place/1"]
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-27T12:34:56.000Z"
 *
 *     CreateItineraryRequest:
 *       type: object
 *       required:
 *         - start_date
 *         - end_date
 *       properties:
 *         title:
 *           type: string
 *           example: "Weekend in Chiang Mai"
 *         description:
 *           type: string
 *           example: "A short trip to explore temples and local markets"
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2026-01-10"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2026-01-12"
 *         place_links:
 *           type: array
 *           items:
 *             type: string
 *           example: ["https://maps.example/place/1"]
 *
 *     UpdateItineraryRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         place_links:
 *           type: array
 *           items:
 *             type: string
 *
 *     GroupItineraryAssignRequest:
 *       type: object
 *       required:
 *         - itinerary_id
 *       properties:
 *         itinerary_id:
 *           type: integer
 *           example: 10
 *
 *     ItinerariesListResponse:
 *       type: object
 *       properties:
 *         itineraries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Itinerary'
 *         pagination:
 *           type: object
 *           properties:
 *             current_page:
 *               type: integer
 *               example: 1
 *             total_pages:
 *               type: integer
 *               example: 5
 *             total_records:
 *               type: integer
 *               example: 42
 *             per_page:
 *               type: integer
 *               example: 10
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/v2/itineraries:
 *   post:
 *     tags:
 *       - Itinerary (v2)
 *     summary: Create an itinerary
 *     description: Create a new itinerary for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateItineraryRequest'
 *     responses:
 *       201:
 *         description: Itinerary created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Itinerary'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v2/itineraries:
 *   get:
 *     tags:
 *       - Itinerary (v2)
 *     summary: Get all itineraries
 *     description: Retrieve a paginated list of itineraries for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of itineraries with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItinerariesListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v2/itineraries/{itinerary_id}:
 *   get:
 *     tags:
 *       - Itinerary (v2)
 *     summary: Get itinerary by id
 *     description: Retrieve a single itinerary by id (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itinerary_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Itinerary found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Itinerary'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   put:
 *     tags:
 *       - Itinerary (v2)
 *     summary: Update an itinerary
 *     description: Update itinerary fields (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itinerary_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateItineraryRequest'
 *     responses:
 *       200:
 *         description: Itinerary updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Itinerary'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     tags:
 *       - Itinerary (v2)
 *     summary: Delete an itinerary
 *     description: Remove an itinerary (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itinerary_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Itinerary deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Itinerary deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v2/groups/{group_id}/itineraries:
 *   get:
 *     tags:
 *       - Group Itinerary (v2)
 *     summary: Get group's itineraries
 *     description: Retrieve itineraries assigned to a group (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of group's itineraries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 itineraries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Itinerary'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v2/groups/{group_id}/itineraries/assign:
 *   post:
 *     tags:
 *       - Group Itinerary (v2)
 *     summary: Assign an itinerary to a group
 *     description: Assign an existing itinerary to a group (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroupItineraryAssignRequest'
 *     responses:
 *       200:
 *         description: Itinerary assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Itinerary assigned to group"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v2/groups/{group_id}/itineraries/{itinerary_id}:
 *   delete:
 *     tags:
 *       - Group Itinerary (v2)
 *     summary: Remove itinerary from group
 *     description: Unassign an itinerary from a group (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itinerary_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Itinerary removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Itinerary removed from group"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
