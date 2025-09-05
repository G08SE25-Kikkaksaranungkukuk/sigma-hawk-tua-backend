import { GroupRepository } from "@/repository/Group/groupRepository";
import { AppError } from "@/types/error/AppError";
import { groupCreateReq } from "@/types/group/groupRequest";

export class GroupService {
    private grouprepository: GroupRepository;

    constructor() {
        this.grouprepository = new GroupRepository();
    }

    async createNewGroup(group_data: groupCreateReq) {
        try {
            const newGroup = await this.grouprepository.createNewGroup(group_data);
            return newGroup;
        } catch (error) {
            console.error(error)
            throw new AppError("Failed to create group", 500);
        }
    }

    async joinGroup(group_id : number) {
        
    }
}
