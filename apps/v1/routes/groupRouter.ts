import { GroupController } from "@/v1/controllers/group/groupController";
import { groupMiddleware } from "@/v1/middlewares/groupMiddleware";
import multer from "multer";
import { BaseRouter } from "@/utils/baseRouter";

const upload = multer({ dest: "uploads/", storage: multer.memoryStorage() });

export class GroupRouter extends BaseRouter {
    private groupController: GroupController;

    constructor() {
        super({
            prefix: "",
        });
        this.groupController = new GroupController();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        // this.router.use(groupMiddleware);
        this.router.post(
            "",
            upload.single("profile"), // Optional profile image upload
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

        this.router.put(
            "/:id/profile",
            upload.single("profile"), // Multer middleware for file upload
            groupMiddleware,
            this.groupController.uploadGroupProfile.bind(this.groupController)
        );

        this.router.get(
            "/:id/profile",
            this.groupController.getGroupProfile.bind(this.groupController)
        );

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

        this.router.patch(
            "/:id/owner",
            groupMiddleware,
            this.groupController.transferGroupOwner.bind(this.groupController)
        );

        this.router.get(
            "/:id/members",
            this.groupController.getGroupMembers.bind(this.groupController)
        );

        this.router.get(
            "/my/groups",
            groupMiddleware,
            this.groupController.getMyGroups.bind(this.groupController)
        );
    }
}
