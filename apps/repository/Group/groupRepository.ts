import { groupCreateReq, groupMemberReq, groupFilterReq, groupFilterRes } from "@/types/group/groupRequest";
import { prisma } from "@/config/prismaClient";
import { Group } from "@/prisma/index";
import { AppError } from "@/types/error/AppError";
import { config } from "@/config/config";
import axios from "axios";

export class GroupRepository {
    async createNewGroup(group_data: groupCreateReq): Promise<Group> {
        const { interest_fields, profile, ...groupData } = group_data;
        
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

        // Normalize interest_id to array of numbers
        let interestIdArr: number[] = [];
        if (Array.isArray(interest_id)) {
            interestIdArr = interest_id.map(id => Number(id)).filter(id => !isNaN(id));
        } else if (typeof interest_id === 'string' || typeof interest_id === 'number') {
            const numId = Number(interest_id);
            if (!isNaN(numId)) interestIdArr = [numId];
        }

        // Build where clause
        const where: Record<string, any> = {};

        if (group_name?.trim()) {
            where.group_name = {
                contains: group_name.trim(),
                mode: "insensitive"
            };
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

            // Filter groups so every interestIdArr is in the group.groupInterests
            let filteredGroups = groups;
            if (interestIdArr.length > 0) {
                filteredGroups = groups.filter(group => {
                    const groupInterestIds = group.groupInterests.map(gi => gi.interest_id);
                    return interestIdArr.every(id => groupInterestIds.includes(id));
                });
            }

            // Transform the data to match the expected format
            const transformedGroups = filteredGroups.map(group => ({
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
                group_count: transformedGroups.length
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
                                    email: true,
                                    birth_date: true
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
                            email: true,
                            birth_date: true
                        }
                    },
                    Belongs: {
                        include: {
                            User: {
                                select: {
                                    user_id: true,
                                    first_name: true,
                                    last_name: true,
                                    email: true,
                                    birth_date: true
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

    async uploadGroupProfile(group_id: number, img: Express.Multer.File | undefined): Promise<void> {
        try {
            if (!img) throw new AppError("Image is not uploaded", 400);
            
            const file_ext = img.originalname.split(".").at(-1);
            if (!file_ext) throw new AppError("Invalid file format", 400);
            
            const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            if (!supportedExtensions.includes(file_ext.toLowerCase())) {
                throw new AppError("Unsupported file format. Supported formats: jpg, jpeg, png, gif, webp", 400);
            }
            
            // Add timestamp to filename to bust browser cache
            const timestamp = Date.now();
            const uploadPath = `/public/group/${group_id}_${timestamp}.${file_ext}`;
            
            console.log('📤 Uploading to file server:', config.FILE_SERVER_URL + uploadPath);
            
            try {
                await axios.put(config.FILE_SERVER_URL + uploadPath, img.buffer);
                console.log('✅ File server upload successful');
            } catch (uploadError: any) {
                console.error('❌ File server upload failed:', uploadError.message);
                throw new AppError("Failed to upload image to file server", 500);
            }
        
            await prisma.group.update({
                where: { group_id },
                data: {
                    profile_url: uploadPath
                }
            });
            
            console.log('💾 Database updated with new profile_url:', uploadPath);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Failed to update group profile", 500);
        }
    }

    async getGroupProfileImage(group_id: number): Promise<{ imageBuffer?: Buffer, contentType?: string, hasProfile: boolean }> {
        try {
            // First get the group to check if it exists and get profile_url
            const group = await prisma.group.findFirstOrThrow({
                where: { group_id },
                select: { profile_url: true }
            });

            if (!group.profile_url) {
                return {
                    hasProfile: false
                };
            }

            // Normalize URL to avoid double slashes
            const baseUrl = config.FILE_SERVER_URL.replace(/\/+$/, ''); // Remove trailing slashes
            const fullUrl = baseUrl + group.profile_url;

            try {
                // Fetch the image from the file server
                const response = await axios.get(fullUrl, {
                    responseType: 'arraybuffer',
                    timeout: 10000 // 10 second timeout
                });

                // Determine content type from file extension
                const fileExt = group.profile_url.split('.').pop()?.toLowerCase();
                let contentType = 'image/jpeg'; // default
                
                switch (fileExt) {
                    case 'png':
                        contentType = 'image/png';
                        break;
                    case 'gif':
                        contentType = 'image/gif';
                        break;
                    case 'webp':
                        contentType = 'image/webp';
                        break;
                    case 'jpg':
                    case 'jpeg':
                    default:
                        contentType = 'image/jpeg';
                        break;
                }

                return {
                    imageBuffer: Buffer.from(response.data),
                    contentType,
                    hasProfile: true
                };

            } catch (fetchError: any) {
                if (fetchError.response?.status === 404) {
                    return {
                        hasProfile: false
                    };
                }
                throw new AppError("Failed to fetch image from file server", 500);
            }

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Cannot find specified group", 404);
        }
    }

    async updateGroup(group_id: number, update_data: Partial<groupCreateReq>): Promise<Group> {
        try {
            const { interest_fields, profile, ...groupData } = update_data;
            
            // Handle profile image upload first if provided
            if (profile) {
                try {
                    await this.uploadGroupProfile(group_id, profile);
                } catch (profileError) {
                    console.error('❌ Failed to upload group profile image during update:', profileError);
                    // Continue even if profile upload fails
                }
            }
            
            // Update basic group info only if there are fields to update
            if (Object.keys(groupData).length > 0) {
                await prisma.group.update({
                    where: { group_id },
                    data: groupData
                });
            }

            // Update interests if provided
            if (interest_fields !== undefined) {
                // Remove all existing interests
                await prisma.groupInterest.deleteMany({
                    where: { group_id }
                });
                
                // Add new interests if any
                if (interest_fields.length > 0) {
                    await this.addGroupInterestsByKeys(group_id, interest_fields);
                }
            }

            // Fetch and return the final state from database to ensure we have the latest profile_url
            const finalGroup = await prisma.group.findFirstOrThrow({
                where: { group_id }
            });
            
            return finalGroup;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error('❌ Error in updateGroup:', error);
            throw new AppError("Failed to update group", 500);
        }
    }
}