import { groupCreateReq, groupMemberAddReq } from "@/types/group/groupRequest";
import { prisma } from "@/config/prismaClient";
import { Group } from "@/prisma/index";

export class GroupRepository {
    async createNewGroup(group_data: groupCreateReq): Promise<Group> {
        const group = await prisma.group.create({
            data: group_data,
        });
        return group;
    }

    async findGroup(group_id : number) {
        const group = await prisma.group.findFirstOrThrow({
            where : {
                group_id
            }
        })
        return group;
    }

    async GroupMemberAdd({group_id , user_id} : groupMemberAddReq) : Promise<any> {
        const belongs = await prisma.user.update({
            where : {
                user_id
            },
            data : {
                groups : {
                    connect : {group_id}
                }
            }
        })
        return belongs
    }

    async GroupMemberRemove({group_id , user_id} : groupMemberAddReq) {
        const belongs = await prisma.user.update({
            where : {
                user_id
            },
            data : {
                groups : {
                    disconnect : {group_id}
                }
            }
        })
        return belongs
    }
}