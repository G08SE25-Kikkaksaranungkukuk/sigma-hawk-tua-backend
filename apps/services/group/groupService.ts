import { Interest } from "@/prisma/index";
import { GroupRepository } from "@/repository/Group/groupRepository";
import { AppError } from "@/types/error/AppError";

export class GroupService {
    private grouprepository: GroupRepository;

    constructor() {
        this.grouprepository = new GroupRepository();
    }

    async createNewGroup(group_data: any) {
        try {
            const newGroup = await this.grouprepository.createNewGroup(group_data);
            return newGroup;
        } catch (error) {
            throw new AppError("Failed to create group", 500);
        }
    }
}
