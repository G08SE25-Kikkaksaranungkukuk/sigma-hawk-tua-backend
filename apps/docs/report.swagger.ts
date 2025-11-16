/**
 * @swagger
 * components:
 *   schemas:
 *     CreateReportRequest:
 *       type: object
 *       required:
 *         - title
 *         - report_tag_id
 *       properties:
 *         title:
 *           type: string
 *           example: "App crashes when saving"
 *         report_tag_id:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1]
 *         description:
 *           type: string
 *           example: "Steps to reproduce: ..."
 *
 *     UpdateReportRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Updated title"
 *         report_tag_id:
 *           type: array
 *           items:
 *             type: integer
 *           example: [2]
 *         description:
 *           type: string
 *           example: "Updated description"
 *
 *     ReportTag:
 *       type: object
 *       properties:
 *         report_tag_id:
 *           type: integer
 *           example: 1
 *         key:
 *           type: string
 *           example: "BUG"
 *         label:
 *           type: string
 *           example: "Bug/Error"
 *         emoji:
 *           type: string
 *           example: "🐛"
 *
 *     Report:
 *       type: object
 *       properties:
 *         report_id:
 *           type: integer
 *           example: 123
 *         user_id:
 *           type: integer
 *           example: 5
 *         title:
 *           type: string
 *           example: "App crashes when saving"
 *         description:
 *           type: string
 *           example: "Detailed description..."
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-27T12:34:56.000Z"
 *         report_tag:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReportTag'
 *
 *     ReportsListResponse:
 *       type: object
 *       properties:
 *         reports:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Report'
 *         pagination:
 *           type: object
 *           properties:
 *             current_page:
 *               type: integer
 *               example: 1
 *             total_pages:
 *               type: integer
 *               example: 10
 *             total_records:
 *               type: integer
 *               example: 100
 *             per_page:
 *               type: integer
 *               example: 10
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *
 */

/**
 * @swagger
 * /api/v2/reports:
 *   post:
 *     tags:
 *       - Report (v2)
 *     summary: Create a new report
 *     description: Create a technical report (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReportRequest'
 *     responses:
 *       201:
 *         description: Report created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
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
 * /api/v2/reports:
 *   get:
 *     tags:
 *       - Report (v2)
 *     summary: Get reports (admin)
 *     description: Retrieve all reports with optional filters (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: reason
 *         schema:
 *           type: string
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
 *         description: List of reports with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportsListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (requires admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v2/reports/reasons:
 *   get:
 *     tags:
 *       - Report (v2)
 *     summary: Get all report reasons/tags
 *     description: Retrieve the list of report tags (public)
 *     responses:
 *       200:
 *         description: List of report tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReportTag'
 */

/**
 * @swagger
 * /api/v2/reports/{id}:
 *   get:
 *     tags:
 *       - Report (v2)
 *     summary: Get report by id
 *     description: Retrieve a single report (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Report found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
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
 *       - Report (v2)
 *     summary: Update a report
 *     description: Update report fields and tags (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReportRequest'
 *     responses:
 *       200:
 *         description: Report updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
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
 *       - Report (v2)
 *     summary: Delete a report (admin)
 *     description: Remove a report (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Report deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Report deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden (requires admin)
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
