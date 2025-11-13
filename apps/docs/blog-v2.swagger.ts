/**
 * @swagger
 * /api/v2/blogs/media:
 *   post:
 *     tags:
 *       - Blog (v2)
 *     summary: Upload blog media
 *     description: Upload media file for blog content (max 5MB)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - media
 *             properties:
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: "Media file (image/video, max 5MB)"
 *     responses:
 *       200:
 *         description: Media uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 path:
 *                   type: string
 *                   description: "URL or path to the uploaded media"
 *                   example: "https://storage.example.com/blog/media/12345.jpg"
 *       400:
 *         description: Invalid file or missing media
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
 * /api/v2/blogs:
 *   post:
 *     tags:
 *       - Blog (v2)
 *     summary: Create a new blog
 *     description: Create a new blog post (requires authentication)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: "Blog title"
 *                 example: "Amazing Trip to Chiang Mai"
 *               content:
 *                 type: string
 *                 description: "Blog content (HTML or markdown)"
 *                 example: "Our journey through the beautiful northern city..."
 *               location:
 *                 type: string
 *                 description: "Location of the blog"
 *                 example: "Chiang Mai, Thailand"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Blog tags"
 *                 example: ["TEMPLE", "NATURE", "FOOD"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Image URLs (from uploaded media)"
 *                 example: ["https://storage.example.com/blog/media/12345.jpg"]
 *               banner_url:
 *                 type: string
 *                 description: "Banner image URL"
 *                 example: "https://storage.example.com/blog/banner/12345.jpg"
 *               interest_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: "Related interest IDs"
 *                 example: [1, 3, 5]
 *     responses:
 *       200:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blog_id:
 *                   type: string
 *                   description: "Unique blog identifier"
 *                   example: "blog_1234567890"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Not logged in
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
 * /api/v2/blogs/{blog_id}/manifest:
 *   get:
 *     tags:
 *       - Blog (v2)
 *     summary: Get blog manifest
 *     description: Get detailed blog information for editing (requires authentication and ownership)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: blog_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog manifest retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not the blog owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Blog not found
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
 * /api/v2/blogs/{blog_id}/likes:
 *   get:
 *     tags:
 *       - Blog (v2)
 *     summary: Get blog likes
 *     description: Get like count and check if current user liked the blog (requires authentication for personalized response)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: blog_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog likes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_like_by_me:
 *                   type: boolean
 *                   description: "Whether current user liked this blog"
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: "Total number of likes"
 *                   example: 42
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Blog not found
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
 *       - Blog (v2)
 *     summary: Like a blog
 *     description: Add a like to a blog post (requires authentication)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: blog_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID to like
 *     responses:
 *       200:
 *         description: Blog liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Already liked or invalid blog ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Blog not found
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
 *       - Blog (v2)
 *     summary: Unlike a blog
 *     description: Remove like from a blog post (requires authentication)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: blog_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID to unlike
 *     responses:
 *       200:
 *         description: Blog unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Not liked yet or invalid blog ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Blog not found
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
 * /api/v2/blogs/{blog_id}:
 *   put:
 *     tags:
 *       - Blog (v2)
 *     summary: Update a blog
 *     description: Update blog content (requires authentication and ownership)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: blog_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "Updated blog title"
 *               content:
 *                 type: string
 *                 description: "Updated blog content"
 *               location:
 *                 type: string
 *                 description: "Updated location"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Updated tags"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Updated image URLs"
 *               banner_url:
 *                 type: string
 *                 description: "Updated banner URL"
 *               interest_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: "Updated interest IDs"
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blog_id:
 *                   type: string
 *                   description: "Blog ID"
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not the blog owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Blog not found
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
 *       - Blog (v2)
 *     summary: Delete a blog
 *     description: Delete blog post (requires authentication and ownership)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: blog_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID to delete
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not the blog owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Blog not found
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
 * /api/v2/blogs/{blog_id}/content:
 *   get:
 *     tags:
 *       - Blog (v2)
 *     summary: Get public blog content
 *     description: Get blog content for public viewing (no authentication required)
 *     parameters:
 *       - name: blog_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
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
 * /api/v2/blogs/{blog_id}/banner:
 *   get:
 *     tags:
 *       - Blog (v2)
 *     summary: Get blog banner
 *     description: Get blog banner image (no authentication required)
 *     parameters:
 *       - name: blog_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog banner retrieved successfully
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 banner_url:
 *                   type: string
 *                   description: "Banner image URL"
 *       404:
 *         description: Blog or banner not found
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
 * /api/v2/blogs/list/me:
 *   get:
 *     tags:
 *       - Blog (v2)
 *     summary: Get my blogs
 *     description: Get all blogs created by the authenticated user
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 total:
 *                   type: integer
 *                   description: "Total number of user's blogs"
 *                   example: 5
 *       401:
 *         description: Unauthorized - Not logged in
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
