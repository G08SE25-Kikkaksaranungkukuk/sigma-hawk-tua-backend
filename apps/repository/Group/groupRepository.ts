import { groupCreateReq, groupMemberAddReq, groupFilterReq, groupFilterRes } from "@/types/group/groupRequest";
import { prisma } from "@/config/prismaClient";
import { Group } from "@/prisma/index";

export class GroupRepository {
    async createNewGroup(group_data: groupCreateReq): Promise<Group> {
        const group = await prisma.group.create({
            data: group_data,
        });
        return group;
    }

    async findGroup(group_id: number) {
        const group = await prisma.group.findFirstOrThrow({
            where: {
                group_id
            }
        })
        return group;
    }

    async GroupMemberAdd({ group_id, user_id }: groupMemberAddReq) {
        const belongs = await prisma.user.update({
            where: {
                user_id
            },
            data: {
                groups: {
                    connect: { group_id }
                }
            }
        })
        return belongs
    }

    async GroupMemberRemove({ group_id, user_id }: groupMemberAddReq) {
        const belongs = await prisma.user.update({
            where: {
                user_id
            },
            data: {
                groups: {
                    disconnect: { group_id }
                }
            }
        })
        return belongs
    }

    async GetFilteredGroups(filter: groupFilterReq): Promise<groupFilterRes> {
        const {
            interest_fields,
            group_name,
            page = 1,
            page_size = 10
        } = filter;

        const where: any = {};

        if (interest_fields && interest_fields.length > 0) {
            where.interest_fields = {
                hasSome: interest_fields
            };
        }

        if (group_name) {
            where.group_name = {
                contains: group_name,
                mode: "insensitive"
            };
        }

        const [groups, group_count] = await Promise.all([
            prisma.group.findMany({
                where,
                skip: (page - 1) * page_size,
                take: page_size,
                select: {
                    group_name: true,
                    interest_fields: true
                }
            }),
            prisma.group.count({ where })
        ]);

        return {
            group_array: groups,
            group_count
        };
    }
}