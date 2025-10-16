import { PrismaClient, Itinerary, GroupItinerary, Place, Group } from "@/prisma/index";
import { ItineraryCreateRequest, ItineraryUpdateRequest } from "@/types/itinerary/itineraryRequest";
import { AppError } from "@/types/error/AppError";

/**
 * Itinerary Repository
 * Handles all database operations for itineraries and group itineraries
 */
export class ItineraryRepository {
    private prisma: PrismaClient;

    constructor(prisma?: PrismaClient) {
        this.prisma = prisma || new PrismaClient();
    }

    /**
     * Create a new itinerary
     */
    async createItinerary(data: ItineraryCreateRequest): Promise<Itinerary> {
        try {
            const itinerary = await this.prisma.itinerary.create({
                data: {
                    title: data.title,
                    description: data.description,
                    start_date: new Date(data.start_date),
                    end_date: new Date(data.end_date)
                },
                include: {
                    groups: {
                        include: {
                            group: {
                                include: {
                                    leader: {
                                        select: {
                                            first_name: true,
                                            last_name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return itinerary;
        } catch (error: any) {
            throw new AppError(`Failed to create itinerary: ${error.message}`, 500);
        }
    }

    /**
     * Get itinerary by ID with all related data
     */
    async getItineraryById(itineraryId: number): Promise<Itinerary | null> {
        try {
            const itinerary = await this.prisma.itinerary.findUnique({
                where: { itinerary_id: itineraryId },
                include: {
                    groups: {
                        include: {
                            group: {
                                include: {
                                    leader: {
                                        select: {
                                            first_name: true,
                                            last_name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return itinerary;
        } catch (error: any) {
            throw new AppError(`Failed to fetch itinerary: ${error.message}`, 500);
        }
    }

    /**
     * Get all itineraries for a specific group
     */
    async getGroupItineraries(groupId: number): Promise<Itinerary[]> {
        try {
            const groupItineraries = await this.prisma.groupItinerary.findMany({
                where: { group_id: groupId },
                include: {
                    itinerary: {
                        include: {
                            _count: {
                                select: {
                                    groups: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            return groupItineraries.map(gi => gi.itinerary);
        } catch (error: any) {
            throw new AppError(`Failed to fetch group itineraries: ${error.message}`, 500);
        }
    }

    /**
     * Update an existing itinerary
     */
    async updateItinerary(itineraryId: number, data: ItineraryUpdateRequest): Promise<Itinerary> {
        try {
            // Update with new data
            const updateData: any = {};
            if (data.title) updateData.title = data.title;
            if (data.description !== undefined) updateData.description = data.description;
            if (data.start_date) updateData.start_date = new Date(data.start_date);
            if (data.end_date) updateData.end_date = new Date(data.end_date);

            const itinerary = await this.prisma.itinerary.update({
                where: { itinerary_id: itineraryId },
                data: updateData,
                include: {
                    groups: {
                        include: {
                            group: {
                                include: {
                                    leader: {
                                        select: {
                                            first_name: true,
                                            last_name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return itinerary;
        } catch (error: any) {
            throw new AppError(`Failed to update itinerary: ${error.message}`, 500);
        }
    }

    /**
     * Delete an itinerary
     */
    async deleteItinerary(itineraryId: number): Promise<void> {
        try {
            await this.prisma.itinerary.delete({
                where: { itinerary_id: itineraryId }
            });
        } catch (error: any) {
            throw new AppError(`Failed to delete itinerary: ${error.message}`, 500);
        }
    }

    /**
     * Assign itinerary to a group
     */
    async assignItineraryToGroup(itineraryId: number, groupId: number): Promise<void> {
        try {
            await this.prisma.groupItinerary.create({
                data: {
                    group_id: groupId,
                    itinerary_id: itineraryId
                }
            });
        } catch (error: any) {
            throw new AppError(`Failed to assign itinerary to group: ${error.message}`, 500);
        }
    }

    /**
     * Remove itinerary from a group
     */
    async removeItineraryFromGroup(itineraryId: number, groupId: number): Promise<void> {
        try {
            await this.prisma.groupItinerary.delete({
                where: {
                    group_id_itinerary_id: {
                        group_id: groupId,
                        itinerary_id: itineraryId
                    }
                }
            });
        } catch (error: any) {
            throw new AppError(`Failed to remove itinerary from group: ${error.message}`, 500);
        }
    }

    /**
     * Check if user is a member of the group
     */
    async isUserGroupMember(userId: number, groupId: number): Promise<boolean> {
        try {
            const membership = await this.prisma.belongs.findFirst({
                where: {
                    A: groupId,
                    B: userId
                }
            });

            return !!membership;
        } catch (error: any) {
            throw new AppError(`Failed to check group membership: ${error.message}`, 500);
        }
    }

    /**
     * Check if user is the leader of the group
     */
    async isUserGroupLeader(userId: number, groupId: number): Promise<boolean> {
        try {
            const group = await this.prisma.group.findFirst({
                where: {
                    group_id: groupId,
                    group_leader_id: userId
                }
            });

            return !!group;
        } catch (error: any) {
            throw new AppError(`Failed to check group leadership: ${error.message}`, 500);
        }
    }

    /**
     * Check if itinerary exists
     */
    async itineraryExists(itineraryId: number): Promise<boolean> {
        try {
            const itinerary = await this.prisma.itinerary.findUnique({
                where: { itinerary_id: itineraryId }
            });

            return !!itinerary;
        } catch (error: any) {
            throw new AppError(`Failed to check itinerary existence: ${error.message}`, 500);
        }
    }

    /**
     * Check if group exists
     */
    async groupExists(groupId: number): Promise<boolean> {
        try {
            const group = await this.prisma.group.findUnique({
                where: { group_id: groupId }
            });

            return !!group;
        } catch (error: any) {
            throw new AppError(`Failed to check group existence: ${error.message}`, 500);
        }
    }
}