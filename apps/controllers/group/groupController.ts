import { Request, Response } from "express";
import { GroupService } from "@/services/group/groupService";
import { groupCreateReq, GroupMemberReq, groupFilterReq } from "@/types/group/groupRequest";
import { groupCreateSchema } from "@/utils/groupValidation";
import { BaseController } from "@/controllers/BaseController";

export class GroupController extends BaseController {
    private groupService: GroupService;

    constructor() {
        super();
        this.groupService = new GroupService();
    }

    async createGroup(req: Request, res: Response): Promise<void> {
        try {
            const reqPayload = { ...req.body, group_leader_id: req.user?.user_id ?? -1 };
            const reqParsed = await groupCreateSchema.parseAsync(reqPayload);
            const newGroup = await this.groupService.createNewGroup(reqParsed as groupCreateReq);
            this.handleSuccess(res, newGroup, 201, "Group created successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async addGroupUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const joinGroup = await this.groupService.joinGroup(Number(id), req.user?.user_id ?? -1);
            this.handleSuccess(res, null, 200, "Group joined successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async removeGroupUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { user_id } = req.body;
            const payload = { group_id: Number(id), user_id: Number(user_id) } as GroupMemberReq;
            const removeUser = await this.groupService.removeGroupUser(Number(id), req.user?.user_id ?? -1, payload.user_id);
            this.handleSuccess(res, null, 200, "Group user removed successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async transferGroupOwner(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { user_id } = req.body;
            const payload = { group_id: Number(id), user_id: Number(user_id) } as GroupMemberReq;
            const transferOwner = await this.groupService.transferOwnership(Number(id), req.user?.user_id ?? -1, payload.user_id);
            this.handleSuccess(res, null, 200, `Group ownership transferred to user ${payload.user_id}`);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async getGroup(req: Request, res: Response): Promise<void> {
        try {
            const groupId = Number(req.params.groupId);
            const group = await this.groupService.getGroup({ group_id: groupId });
            this.handleSuccess(res, group, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async filterGroups(req: Request, res: Response): Promise<void> {
        try {
            const filter = req.query;
            const groups = await this.groupService.filterGroups(filter as groupFilterReq);
            this.handleSuccess(res, groups, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async getGroupMembers(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const members = await this.groupService.getGroupMembers(Number(id));
            this.handleSuccess(res, members, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }
}
