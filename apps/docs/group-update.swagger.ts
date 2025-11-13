/**
 * @swagger
 * /api/v1/group/{groupId}:
 *   put:
 *     tags:
 *       - Group (v1)
 *     summary: Update group details
 *     description: Update group information (owner only). Can optionally include a new profile image.
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Bangkok Temple Tour"
 *               description:
 *                 type: string
 *                 example: "Updated: Explore ancient temples in Bangkok"
 *               max_members:
 *                 type: integer
 *                 minimum: 2
 *                 maximum: 20
 *                 example: 10
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-04-15"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-04-20"
 *               budget_min:
 *                 type: number
 *                 minimum: 0
 *                 example: 6000
 *               budget_max:
 *                 type: number
 *                 minimum: 0
 *                 example: 18000
 *               location:
 *                 type: string
 *                 example: "Bangkok, Thailand"
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["TEMPLE", "CULTURE", "HISTORY", "FOOD"]
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: "Optional new group profile image (max 10MB)"
 *     responses:
 *       200:
 *         description: Group updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       400:
 *         description: Validation error or invalid data
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
 *       403:
 *         description: Forbidden - Only group owner can update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       413:
 *         description: File too large (exceeds 10MB limit)
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
