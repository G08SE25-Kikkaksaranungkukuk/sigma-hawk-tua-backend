import { groupCreateReq, groupMemberReq, groupFilterReq, groupFilterRes } from "@/types/group/groupRequest";
import { prisma } from "@/config/prismaClient";
import { Group } from "@/prisma/index";
import { AppError } from "@/types/error/AppError";

export class GroupRepository {
    async createNewGroup(group_data: groupCreateReq): Promise<Group> {
        const { interest_fields, ...groupData } = group_data;
        
        // Create group first
        const group = await prisma.group.create({
            data: groupData,
        });

        // Add interests if provided
        if (interest_fields && interest_fields.length > 0) {
            await this.addGroupInterestsByKeys(group.group_id, interest_fields);
        }

        return group;
    }

    async findGroup(group_id : number) {
        try {
            const group = await prisma.group.findFirstOrThrow({
                where : {
                    group_id
                },
                include : {
                    Belongs : {
                        include: {
                            User: {
                                omit : {
                                    "birth_date": true,
                                    "social_credit": true,
                                    "password": true,
                                    "email": true,
                                    "phone" : true,
                                    "role" : true 
                                }
                            }
                        }
                    }
                },
                omit : {
                    
                }
            })
            return group;
        }
        catch {
            throw new AppError("Cannot find specified group",404);
        }
    }

    async GroupMemberAdd({group_id , user_id} : groupMemberReq) {
        const belongs = await prisma.belongs.create({
            data: {
                A: group_id,
                B: user_id
            }
        })
        return belongs
    }

    async GroupMemberRemove({group_id , user_id} : groupMemberReq) {
        const belongs = await prisma.belongs.deleteMany({
            where: {
                A: group_id,
                B: user_id
            }
        })
        return belongs
    }

    async GetFilteredGroups(filter: groupFilterReq): Promise<groupFilterRes> {
        // Input validation and normalization
        filter.page = Number(filter.page) || 1;
        filter.page_size = Math.min(100, Math.max(1, Number(filter.page_size) || 10)); // Cap at 100
        const {
            interest_id,
            group_name,
            page,
            page_size
        } = filter;
        // Build where clause
        const where: Record<string, any> = {};

        let interestIds: number[] = [];
        if (typeof interest_id === "number" || typeof interest_id === "string") {
            interestIds = [Number(interest_id)].filter(n => !isNaN(n));
        } else if (Array.isArray(interest_id)) {
            interestIds = interest_id.map(Number).filter((n: number) => !isNaN(n));
        }
        if (interestIds.length > 0) {
            // Require every interest_id to match
            where.AND = interestIds.map(id => ({
                groupInterests: {
                    some: {
                        interest_id: id
                    }
                }
            }));
        }

        if (group_name?.trim()) {
            where.group_name = {
                contains: group_name.trim(),
                mode: "insensitive"
            }
        }

        try {
            const [groups, group_count] = await Promise.all([
                prisma.group.findMany({
                    where,
                    skip: (page - 1) * page_size,
                    take: page_size,
                    select: {
                        group_id: true,
                        group_name: true,
                        group_leader_id: true,
                        description: true,
                        max_members: true,
                        created_at: true,
                        updated_at: true,
                        groupInterests: {
                            select: {
                                interest_id: true
                            }
                        }
                    },
                    orderBy: { group_name: 'asc' }
                }),
                prisma.group.count({ where })
            ]);

            // Transform the data to match the expected format
            const transformedGroups = groups.map(group => ({
                group_id: group.group_id,
                group_name: group.group_name,
                group_leader_id: group.group_leader_id,
                description: group.description ?? undefined,
                max_members: group.max_members ?? undefined,
                created_at: group.created_at,
                updated_at: group.updated_at,
                interest_id: group.groupInterests.map(gi => gi.interest_id)
            }));

            return {
                group_array: transformedGroups,
                group_count
            };
        } catch (error) {
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
                    Belongs: {
                        include: {
                            User: {
                                select: {
                                    user_id: true,
                                    first_name: true,
                                    last_name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            });
            return group.Belongs.map(b => b.User);
        } catch {
            throw new AppError("Cannot find specified group", 404);
        }
    }

    // Utility method to add interests to a group
    async addGroupInterests(group_id: number, interest_ids: number[]) {
        try {
            await prisma.groupInterest.createMany({
                data: interest_ids.map(interest_id => ({
                    group_id,
                    interest_id
                })),
                skipDuplicates: true
            });
        } catch (error) {
            throw new AppError("Failed to add interests to group", 500);
        }
    }

    // Utility method to remove interests from a group
    async removeGroupInterests(group_id: number, interest_ids: number[]) {
        try {
            await prisma.groupInterest.deleteMany({
                where: {
                    group_id,
                    interest_id: {
                        in: interest_ids
                    }
                }
            });
        } catch (error) {
            throw new AppError("Failed to remove interests from group", 500);
        }
    }

    // Utility method to get group interests
    async getGroupInterests(group_id: number) {
        try {
            const groupInterests = await prisma.groupInterest.findMany({
                where: { group_id },
                include: {
                    interest: true
                }
            });
            return groupInterests.map(gi => gi.interest);
        } catch (error) {
            throw new AppError("Failed to fetch group interests", 500);
        }
    }

    // Utility method to check if user is a member of the group
    async isGroupMember(group_id: number, user_id: number): Promise<boolean> {
        try {
            const belongs = await prisma.belongs.findFirst({
                where: {
                    A: group_id,
                    B: user_id
                }
            });
            return belongs !== null;
        } catch {
            return false;
        }
    }

    // Utility method to get group with full details
    async getGroupWithDetails(group_id: number) {
        try {
            const group = await prisma.group.findFirstOrThrow({
                where: { group_id },
                include: {
                    leader: {
                        select: {
                            user_id: true,
                            first_name: true,
                            last_name: true,
                            email: true
                        }
                    },
                    Belongs: {
                        include: {
                            User: {
                                select: {
                                    user_id: true,
                                    first_name: true,
                                    last_name: true,
                                    email: true
                                }
                            }
                        }
                    },
                    groupInterests: {
                        include: {
                            interest: true
                        }
                    }
                }
            });
            const { Belongs, groupInterests, ...groupWithoutExcludedKeys } = group;
            let payload = {
                ...groupWithoutExcludedKeys,
                members: Belongs.map(b => b.User),
                interests: groupInterests.map(gi => gi.interest)
            };
            return payload;
        } catch {
            throw new AppError("Cannot find specified group", 404);
        }
    }

    async getUserGroups(user_id: number) {
        try {
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    user_id
                },
                include: {
                    Belongs: {
                        include: {
                            groups: {
                                select: {
                                    group_id: true,
                                    group_name: true,
                                    group_leader_id: true,
                                    description: true,
                                    max_members: true,
                                    created_at: true,
                                    updated_at: true
                                }
                            }
                        }
                    }
                }
            });
            return user.Belongs.map(b => b.groups);
        } catch {
            throw new AppError("Failed to fetch user's groups", 404);
        }
    }
    // Utility method to add interests to a group by keys
    async addGroupInterestsByKeys(group_id: number, interest_keys: string[]) {
        try {
            // Convert interest keys to IDs
            const interests = await prisma.interest.findMany({
                where: {
                    key: { in: interest_keys }
                },
                select: { id: true }
            });

            const interest_ids = interests.map(interest => interest.id);

            if (interest_ids.length > 0) {
                await prisma.groupInterest.createMany({
                    data: interest_ids.map(interest_id => ({
                        group_id,
                        interest_id
                    })),
                    skipDuplicates: true
                });
            }
        } catch (error) {
            throw new AppError("Failed to add interests to group", 500);
        }
    }

    // Utility method to remove interests from a group by keys
    async removeGroupInterestsByKeys(group_id: number, interest_keys: string[]) {
        try {
            // Convert interest keys to IDs
            const interests = await prisma.interest.findMany({
                where: {
                    key: { in: interest_keys }
                },
                select: { id: true }
            });

            const interest_ids = interests.map(interest => interest.id);

            if (interest_ids.length > 0) {
                await prisma.groupInterest.deleteMany({
                    where: {
                        group_id,
                        interest_id: {
                            in: interest_ids
                        }
                    }
                });
            }
        } catch (error) {
            throw new AppError("Failed to remove interests from group", 500);
        }
    }
}