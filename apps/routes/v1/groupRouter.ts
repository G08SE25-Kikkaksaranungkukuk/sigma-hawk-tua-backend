import { GroupController } from "@/controllers/group/groupController";
import { groupMiddleware } from "@/middlewares/groupMiddleware";
import { BaseRouter } from "../baseRouter";
import multer from "multer";

const upload = multer({ 
    dest: 'uploads/', 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for group images
});

/**
 * Group Router v1  
 * Handles travel group management endpoints for API version 1
 * Includes group creation, member management, and group operations
 */
export class GroupRouterV1 extends BaseRouter {
    private readonly groupController: GroupController;

    constructor() {
        super({ prefix: "" });
        this.groupController = new GroupController();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        // Group creation and discovery
        this.router.post(
            "",
            upload.single('profile'),
            groupMiddleware,
            this.groupController.createGroup.bind(this.groupController)
        );

        this.router.get(
            "/filter",
            this.groupController.filterGroups.bind(this.groupController)
        );

        this.router.get(
            "/:groupId",
            this.groupController.getGroup.bind(this.groupController)
        );

        // Group profile management
        this.router.put(
            "/:id/profile",
            upload.single('profile'),
            groupMiddleware,
            this.groupController.uploadGroupProfile.bind(this.groupController)
        );

        this.router.get(
            "/:id/profile",
            this.groupController.getGroupProfile.bind(this.groupController)
        );

        // Member management
        this.router.put(
            "/:id/member",
            groupMiddleware,
            this.groupController.addGroupUser.bind(this.groupController)
        );

        this.router.delete(
            "/:id/member", 
            groupMiddleware,
            this.groupController.removeGroupUser.bind(this.groupController)
        );

        this.router.delete(
            "/:id/leave",
            groupMiddleware,
            this.groupController.leaveGroup.bind(this.groupController)
        );

        this.router.get(
            "/:id/members",
            this.groupController.getGroupMembers.bind(this.groupController)
        );

        // Group ownership and administration
        this.router.patch(
            "/:id/owner",
            groupMiddleware,
            this.groupController.transferGroupOwner.bind(this.groupController)
        );

        // User's groups
        this.router.get(
            "/my/groups",
            groupMiddleware,
            this.groupController.getMyGroups.bind(this.groupController)
        );
    }
}