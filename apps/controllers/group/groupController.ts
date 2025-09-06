import { Request, Response } from "express";
import { AppError } from "@/types/error/AppError";
import { GroupService } from "@/services/group/groupService";
import { groupCreateReq, GroupMemberReq, groupFilterReq } from "@/types/group/groupRequest";
import { groupCreateSchema } from "@/utils/groupValidation";

export class GroupController {
    private groupService: GroupService;

    constructor() {
        this.groupService = new GroupService();
    }

    async createGroup(req: Request, res: Response): Promise<void> {
        try {
            const reqPayload = { ...req.body, group_leader_id: req.user?.user_id ?? -1 }
            const reqParsed = await groupCreateSchema.parseAsync(reqPayload)
            const newGroup = await this.groupService.createNewGroup(reqParsed as groupCreateReq);
            res.status(201).json(newGroup);
        } catch (error: unknown) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }

            // console.error("Unexpected error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async addGroupUser(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const joinGroup = await this.groupService.joinGroup(Number(id),req.user?.user_id ?? -1)
            res.status(200).json({message : "group joined"})
        } catch(error : unknown) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async removeGroupUser(req : Request , res : Response) : Promise<void> {
        try {
            const {id} = req.params;
            const {user_id} = req.body
            const payload = {group_id : Number(id) , user_id : Number(user_id)} as GroupMemberReq
            const joinGroup = await this.groupService.removeGroupUser(Number(id),req.user?.user_id ?? -1,payload.user_id)
            res.status(200).json({message : "group user removed"})
        } catch(error : unknown) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async transferGroupOwner(req : Request , res : Response) : Promise<void> {
        try {
            const {id} = req.params;
            const {user_id} = req.body
            const payload = {group_id : Number(id) , user_id : Number(user_id)} as GroupMemberReq
            const transferOwner = await this.groupService.transferOwnership(Number(id),req.user?.user_id ?? -1,payload.user_id)
            res.status(200).json({message : "group owner transfered to user " + payload.user_id})
        } catch(error : unknown) {
            // console.log(error)
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getGroup(req: Request, res: Response): Promise<void> {
        try {
            const groupId = Number(req.params.groupId);
            const group = await this.groupService.getGroup({ group_id: groupId })
            res.status(200).json(group);
        } catch (error: unknown) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async filterGroups(req: Request, res: Response): Promise<void> {
        try {
            const filter = req.query;
            const groups = await this.groupService.filterGroups(filter as groupFilterReq);
            res.status(200).json(groups);
        } catch (error: unknown) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }
            console.error("Unexpected error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
