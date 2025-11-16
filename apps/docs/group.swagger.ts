/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         group_id:
 *           type: integer
 *           description: "Unique group identifier"
 *         name:
 *           type: string
 *           description: "Group name"
 *         description:
 *           type: string
 *           description: "Group description"
 *         max_members:
 *           type: integer
 *           description: "Maximum number of members allowed"
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: "Trip start date"
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: "Trip end date"
 *         budget_min:
 *           type: number
 *           description: "Minimum budget per person"
 *         budget_max:
 *           type: number
 *           description: "Maximum budget per person"
 *         location:
 *           type: string
 *           description: "Trip location"
 *         profile_url:
 *           type: string
 *           description: "Group profile image URL"
 *         owner_id:
 *           type: integer
 *           description: "Group owner user ID"
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           description: "Group interests"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     
 *     CreateGroupRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - max_members
 *         - start_date
 *         - end_date
 *         - budget_min
 *         - budget_max
 *         - location
 *         - interests
 *       properties:
 *         name:
 *           type: string
 *           example: "Bangkok Temple Tour"
 *         description:
 *           type: string
 *           example: "Explore ancient temples in Bangkok"
 *         max_members:
 *           type: integer
 *           minimum: 2
 *           maximum: 20
 *           example: 8
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2024-03-15"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2024-03-20"
 *         budget_min:
 *           type: number
 *           minimum: 0
 *           example: 5000
 *         budget_max:
 *           type: number
 *           minimum: 0
 *           example: 15000
 *         location:
 *           type: string
 *           example: "Bangkok, Thailand"
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           example: ["TEMPLE", "CULTURE", "HISTORY"]
 *           minItems: 1
 *     
 *     GroupMember:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         profile_url:
 *           type: string
 *         joined_at:
 *           type: string
 *           format: date-time
 *     
 *     GroupFilterRequest:
 *       type: object
 *       properties:
 *         location:
 *           type: string
 *           example: "Bangkok"
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2024-03-01"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2024-03-31"
 *         budget_min:
 *           type: number
 *           example: 1000
 *         budget_max:
 *           type: number
 *           example: 10000
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           example: ["TEMPLE", "FOOD"]
 *         page:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           example: 10
 */

/**
 * @swagger
 * /api/v1/group:
 *   post:
 *     tags:
 *       - Group (v1)
 *     summary: Create a new group
 *     description: Create a new travel group with optional profile image
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/CreateGroupRequest'
 *               - type: object
 *                 properties:
 *                   profile:
 *                     type: string
 *                     format: binary
 *                     description: "Optional group profile image"
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/group/filter:
 *   get:
 *     tags:
 *       - Group (v1)
 *     summary: Filter groups
 *     description: Search and filter groups based on various criteria
 *     parameters:
 *       - name: location
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - name: start_date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (from)
 *       - name: end_date
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (to)
 *       - name: budget_min
 *         in: query
 *         schema:
 *           type: number
 *         description: Minimum budget filter
 *       - name: budget_max
 *         in: query
 *         schema:
 *           type: number
 *         description: Maximum budget filter
 *       - name: interests
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by interests (comma-separated)
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
 *         description: Groups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groups:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Group'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/group/{groupId}:
 *   get:
 *     tags:
 *       - Group (v1)
 *     summary: Get group details
 *     description: Retrieve detailed information about a specific group
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Group not found
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
 * /api/v1/group/{id}/profile:
 *   put:
 *     tags:
 *       - Group (v1)
 *     summary: Upload group profile image
 *     description: Upload or update the profile image for a group
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
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
 *                 description: "Group profile image file"
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile_url:
 *                   type: string
 *                   description: "URL of the uploaded profile image"
 *       400:
 *         description: Invalid file or request
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
 *         description: Group not found
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
 *   get:
 *     tags:
 *       - Group
 *     summary: Get group profile image
 *     description: Retrieve the profile image for a group
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Profile image retrieved successfully
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Group or profile image not found
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
 * /api/v1/group/{id}/member:
 *   put:
 *     tags:
 *       - Group (v1)
 *     summary: Add user to group
 *     description: Add a user to the group (requires group access)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: "ID of the user to add to the group"
 *     responses:
 *       200:
 *         description: User added to group successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid request or group is full
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
 *         description: Group or user not found
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
 *       - Group
 *     summary: Remove user from group
 *     description: Remove a user from the group (owner only)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: "ID of the user to remove from the group"
 *     responses:
 *       200:
 *         description: User removed from group successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only group owner can remove members
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Group or user not found
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
 * /api/v1/group/{id}/leave:
 *   delete:
 *     tags:
 *       - Group (v1)
 *     summary: Leave group
 *     description: Leave the group (authenticated user leaves the group)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Successfully left the group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Cannot leave group (e.g., owner trying to leave)
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
 *         description: Group not found or user not in group
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
 * /api/v1/group/{id}/owner:
 *   patch:
 *     tags:
 *       - Group (v1)
 *     summary: Transfer group ownership
 *     description: Transfer ownership of the group to another member
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - new_owner_id
 *             properties:
 *               new_owner_id:
 *                 type: integer
 *                 description: "ID of the user to become the new owner"
 *     responses:
 *       200:
 *         description: Ownership transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only current owner can transfer ownership
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Group or new owner not found
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
 * /api/v1/group/{id}/members:
 *   get:
 *     tags:
 *       - Group (v1)
 *     summary: Get group members
 *     description: Retrieve list of all members in the group
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 members:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GroupMember'
 *                 total_members:
 *                   type: integer
 *                   description: "Total number of members in the group"
 *       404:
 *         description: Group not found
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
 * /api/v1/group/my/groups:
 *   get:
 *     tags:
 *       - Group (v1)
 *     summary: Get user's groups
 *     description: Retrieve all groups that the authenticated user is a member of
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User's groups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groups:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Group'
 *                 total:
 *                   type: integer
 *                   description: "Total number of groups user is member of"
 *       401:
 *         description: Unauthorized
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
