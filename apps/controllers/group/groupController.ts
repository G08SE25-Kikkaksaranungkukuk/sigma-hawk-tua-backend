import { Request, Response } from "express";
import { AppError } from "@/types/error/AppError";
import { GroupService } from "@/services/group/groupService";

export class GroupController {
    private groupService: GroupService;

    constructor() {
        this.groupService = new GroupService();
    }

    async createGroup(req: Request, res: Response): Promise<void> {
        try {
            const groupData = req.body;
            const newGroup = await this.groupService.createNewGroup(groupData);
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
