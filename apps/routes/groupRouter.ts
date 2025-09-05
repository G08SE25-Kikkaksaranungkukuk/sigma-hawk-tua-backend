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

        this.router.put(
            "/member/:id",
            groupMiddleware,
            this.groupController.addGroupUser.bind(this.groupController)
        );

        this.router.delete(
            "/member/:id",
            groupMiddleware,
            this.groupController.removeGroupUser.bind(this.groupController)
        );
    }
}