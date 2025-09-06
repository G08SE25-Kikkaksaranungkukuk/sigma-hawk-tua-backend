import { GroupRepository } from "@/repository/Group/groupRepository";
import { AppError } from "@/types/error/AppError";
import { groupCreateReq, groupGetReq, groupFilterReq } from "@/types/group/groupRequest";

export class GroupService {
    private grouprepository: GroupRepository;

    constructor() {
        this.grouprepository = new GroupRepository();
    }

    async getGroup(group_data: groupGetReq) {
        try {
            const group = await this.grouprepository.findGroup(group_data.group_id);
            return group;
        } catch (error: unknown) {
            //console.error(error)
            throw new AppError("Failed to get group", 500);
        }
    }

    async createNewGroup(group_data: groupCreateReq) {
        try {
            const newGroup = await this.grouprepository.createNewGroup(group_data);
            return newGroup;
        } catch (error: unknown) {
            // console.error(error)
            throw new AppError("Failed to create group", 500);
        }
    }

    async joinGroup(group_id : number,user_id : number) {
        const groupData = await this.grouprepository.findGroup(group_id)
        const joinGroup = await this.grouprepository.GroupMemberAdd({
            user_id,
            "group_id":groupData.group_id
        })
        return joinGroup;
    }

    async removeGroupUser(group_id : number , user_id : number , target_id : number) {
        const groupData = await this.grouprepository.findGroup(group_id);
        const leaderAuthorize = await this.grouprepository.isGroupLeader({group_id , user_id});
        const userRemove = await this.grouprepository.GroupMemberRemove({
            "user_id" : target_id,
            "group_id" : groupData.group_id
        });
        return userRemove;
    }

    async transferOwnership(group_id : number , user_id : number , target_id : number) {
        const groupData = await this.grouprepository.findGroup(group_id);
        const leaderAuthorize = await this.grouprepository.isGroupLeader({group_id , user_id});
        const ownerTransfer = await this.grouprepository.transferGroupOwner({group_id , "user_id" : target_id}) 
        return ownerTransfer
    }

    async filterGroups(filter: groupFilterReq) {
        try {
            const result = await this.grouprepository.GetFilteredGroups(filter);
            return result;
        } catch (error: unknown) {
            console.error(error);
            throw new AppError("Failed to filter groups", 500);
        }
    }
}
