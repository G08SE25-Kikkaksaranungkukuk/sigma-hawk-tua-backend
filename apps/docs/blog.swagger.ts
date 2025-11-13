/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         blog_id:
 *           type: integer
 *           description: "Unique blog identifier"
 *         title:
 *           type: string
 *           description: "Blog title"
 *         content:
 *           type: string
 *           description: "Blog content"
 *         author_id:
 *           type: integer
 *           description: "Author user ID"
 *         author_name:
 *           type: string
 *           description: "Author full name"
 *         location:
 *           type: string
 *           description: "Location related to the blog"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: "Blog tags or categories"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: "Blog image URLs"
 *         likes_count:
 *           type: integer
 *           description: "Number of likes"
 *         comments_count:
 *           type: integer
 *           description: "Number of comments"
 *         views_count:
 *           type: integer
 *           description: "Number of views"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: "Blog creation timestamp"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: "Last update timestamp"
 *     
 *     BlogSearchRequest:
 *       type: object
 *       properties:
 *         q:
 *           type: string
 *           description: "Search query (searches in title, content, tags)"
 *           example: "Bangkok temple"
 *         location:
 *           type: string
 *           description: "Filter by location"
 *           example: "Bangkok"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: "Filter by tags"
 *           example: ["TEMPLE", "CULTURE"]
 *         author_id:
 *           type: integer
 *           description: "Filter by author ID"
 *         from_date:
 *           type: string
 *           format: date
 *           description: "Filter blogs from this date"
 *           example: "2024-01-01"
 *         to_date:
 *           type: string
 *           format: date
 *           description: "Filter blogs until this date"
 *           example: "2024-12-31"
 *         sort_by:
 *           type: string
 *           enum: [created_at, likes_count, views_count, comments_count]
 *           description: "Sort by field"
 *           example: "likes_count"
 *         order:
 *           type: string
 *           enum: [asc, desc]
 *           description: "Sort order"
 *           example: "desc"
 *         page:
 *           type: integer
 *           minimum: 1
 *           description: "Page number for pagination"
 *           example: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           description: "Number of results per page"
 *           example: 10
 */

/**
 * @swagger
 * /api/v1/blog/search:
 *   get:
 *     tags:
 *       - Blog (v1)
 *     summary: Search and filter blogs
 *     description: Search for blogs with various filtering and sorting options (API v1)
 *     parameters:
 *       - name: q
 *         in: query
 *         schema:
 *           type: string
 *         description: Search query (searches in title, content, tags)
 *         example: "Bangkok temple"
 *       - name: location
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by location
 *         example: "Bangkok"
 *       - name: tags
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by tags (comma-separated)
 *         example: "TEMPLE,CULTURE"
 *       - name: author_id
 *         in: query
 *         schema:
 *           type: integer
 *         description: Filter by author ID
 *       - name: from_date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter blogs from this date
 *         example: "2024-01-01"
 *       - name: to_date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter blogs until this date
 *         example: "2024-12-31"
 *       - name: sort_by
 *         in: query
 *         schema:
 *           type: string
 *           enum: [created_at, likes_count, views_count, comments_count]
 *         description: Sort by field
 *         example: "likes_count"
 *       - name: order
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *         example: "desc"
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationResponse'
 *       400:
 *         description: Invalid query parameters
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
