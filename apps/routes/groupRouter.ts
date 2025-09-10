import { GroupController } from "@/controllers/group/groupController";
import { groupMiddleware } from "@/middlewares/groupMiddleware";

import { BaseRouter } from "./baseRouter";

export class GroupRouter extends BaseRouter {
    private groupController : GroupController;

    constructor() {
        super({
            prefix : ""
        });
        this.groupController = new GroupController();
        this.setupRoutes();
    }

    private setupRoutes() : void {
        // this.router.use(groupMiddleware);
        this.router.post(
            "",
            groupMiddleware,
            this.groupController.createGroup.bind(this.groupController)
        );

        this.router.get(
            "/:groupId",
            this.groupController.getGroup.bind(this.groupController)
        );

        // Example GET
        //
        this.router.get(
            "",
            this.groupController.filterGroups.bind(this.groupController)
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