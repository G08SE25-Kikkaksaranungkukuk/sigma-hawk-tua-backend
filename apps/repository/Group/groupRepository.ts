import { groupCreateReq, groupMemberReq, groupFilterReq, groupFilterRes } from "@/types/group/groupRequest";
import { prisma } from "@/config/prismaClient";
import { Group } from "@/prisma/index";
import { AppError } from "@/types/error/AppError";

export class GroupRepository {
    async createNewGroup(group_data: groupCreateReq): Promise<Group> {
        const group = await prisma.group.create({
            data: group_data,
        });
        return group;
    }

    async findGroup(group_id : number) {
        try {
            const group = await prisma.group.findFirstOrThrow({
                where : {
                    group_id
                }
            })
            return group;
        }
        catch {
            throw new AppError("Cannot find specified group",404);
        }
    }

    async GroupMemberAdd({group_id , user_id} : groupMemberReq) {
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

    async GroupMemberRemove({group_id , user_id} : groupMemberReq) {
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
        // Input validation and normalization
        const page = Math.max(1, Number(filter.page) || 1);
        const page_size = Math.min(100, Math.max(1, Number(filter.page_size) || 10)); // Cap at 100

        const {
            interest_fields,
            group_name
        } = filter;

        // Build where clause more efficiently
        const where: Record<string, any> = {};

        if (interest_fields && interest_fields?.length > 0) {
            where.interest_fields = {
                hasEvery: Array.isArray(interest_fields) ? interest_fields : [interest_fields]
            };
        }

        if (group_name?.trim()) {
            where.group_name = {
                contains: group_name.trim(),
                mode: "insensitive"
            };
        }

        // Single database query with aggregation (if your Prisma version supports it)
        try {
            const [groups, group_count] = await Promise.all([
                prisma.group.findMany({
                    where,
                    skip: (page - 1) * page_size,
                    take: page_size,
                    select: {
                        group_name: true,
                        interest_fields: true
                    },
                    // Add ordering for consistent pagination
                    orderBy: { group_name: 'asc' }
                }),
                prisma.group.count({ where })
            ]);

            return {
                group_array: groups,
                group_count
            };
        } catch (error) {
            // Add proper error handling
            console.error('Error fetching filtered groups:', error);
            throw new Error('Failed to fetch groups');
        }
    }

    async isGroupLeader({group_id , user_id} : groupMemberReq) {
        try {
            const belongs = await prisma.group.findFirstOrThrow({
                where : {
                    group_id,
                    group_leader_id : user_id
                }
            })
            return belongs
        }
        catch {
            throw new AppError("Not a group leader",403);
        }
    }

    async transferGroupOwner({group_id , user_id} : groupMemberReq) {
        const ret = await prisma.group.update({
            where: {
                group_id
            },
            data : {
                group_leader_id : {
                    set : user_id
                }
            }
        })
        return ret
    }

    async getGroupMembers(group_id: number) {
        try {
            const group = await prisma.group.findFirstOrThrow({
                where: {
                    group_id
                },
                include: {
                    members: {
                        select: {
                            user_id: true,
                            first_name: true,
                            last_name: true,
                            email: true
                        }
                    }
                }
            });
            return group.members;
        } catch {
            throw new AppError("Cannot find specified group", 404);
        }
    }
}