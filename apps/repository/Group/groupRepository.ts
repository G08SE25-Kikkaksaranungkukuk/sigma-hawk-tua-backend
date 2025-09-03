import { groupCreateReq } from "@/types/group/groupRequest";
import { prisma } from "@/config/prismaClient";
import { Group } from "@/prisma/index";

export class GroupRepository {
    async createNewGroup(group_data: groupCreateReq): Promise<Group> {
        const group = await prisma.group.create({
            data: group_data as Group,
        });
        return group;
    }
}
