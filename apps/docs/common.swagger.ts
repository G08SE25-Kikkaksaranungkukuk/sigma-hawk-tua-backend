/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT Authorization header using the Bearer scheme
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 *       description: JWT token in cookie
 *   
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         error:
 *           type: string
 *           description: Error type or code
 *         details:
 *           type: object
 *           description: Additional error details
 *       example:
 *         message: "Validation failed"
 *         error: "VALIDATION_ERROR"
 *     
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         data:
 *           type: object
 *           description: Optional response data
 *       example:
 *         message: "Operation completed successfully"
 *     
 *     PaginationResponse:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: Current page number
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Number of items per page
 *           example: 10
 *         total:
 *           type: integer
 *           description: Total number of items
 *           example: 100
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 *           example: 10
 *         hasNext:
 *           type: boolean
 *           description: Whether there are more pages
 *           example: true
 *         hasPrev:
 *           type: boolean
 *           description: Whether there are previous pages
 *           example: false
 */
