import { Request, Response } from "express";
import { AppError } from "@/types/error/AppError";
import { GroupService } from "@/services/group/groupService";
import { groupCreateReq } from "@/types/group/groupRequest";
import { groupCreateSchema } from "@/utils/groupValidation";

export class GroupController {
    private groupService: GroupService;

    constructor() {
        this.groupService = new GroupService();
    }

    async createGroup(req: Request, res: Response): Promise<void> {
        try {
            const reqPayload = {...req.body,group_leader_id : req.user?.user_id ?? -1}
            const reqParsed = await groupCreateSchema.parseAsync(reqPayload)
            const newGroup = await this.groupService.createNewGroup(reqParsed as groupCreateReq);
            res.status(201).json(newGroup);
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
