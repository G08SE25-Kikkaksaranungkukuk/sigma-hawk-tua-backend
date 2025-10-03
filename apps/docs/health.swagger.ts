/**
 * @swagger
 * /healthz:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     description: Check if the server is running and healthy
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: "Server uptime in seconds"
 */
