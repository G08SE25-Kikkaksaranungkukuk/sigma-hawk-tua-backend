import { Itinerary, GroupItinerary } from "@/prisma/index";
import { ItineraryRepository } from "@/repository/Itinerary/itineraryRepository";
import { IItineraryService } from "./IItineraryService";
import { ItineraryCreateRequest, ItineraryUpdateRequest } from "@/types/itinerary/itineraryRequest";
import { 
    ItineraryResponse, 
    ItineraryListResponse, 
    GroupItineraryResponse,
    GroupBasicInfo
} from "@/types/itinerary/itineraryDTOs";
import { AppError } from "@/types/error/AppError";

/**
 * Itinerary Service Implementation
 * Contains business logic for itinerary operations
 */
export class ItineraryService implements IItineraryService {
    private readonly repository: ItineraryRepository;

    constructor(repository?: ItineraryRepository) {
        this.repository = repository || new ItineraryRepository();
    }

    /**
     * Create a new itinerary
     */
    async createItinerary(data: ItineraryCreateRequest): Promise<ItineraryResponse> {
        try {
            const itinerary = await this.repository.createItinerary(data);
            return this.mapToItineraryResponse(itinerary);
        } catch (error: any) {
            throw new AppError(`Failed to create itinerary: ${error.message}`, 500);
        }
    }

    /**
     * Get itinerary by ID with full details
     */
    async getItineraryById(itineraryId: number): Promise<ItineraryResponse> {
        try {
            const itinerary = await this.repository.getItineraryById(itineraryId);
            
            if (!itinerary) {
                throw new AppError("Itinerary not found", 404);
            }

            return this.mapToItineraryResponse(itinerary);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(`Failed to get itinerary: ${error.message}`, 500);
        }
    }

    /**
     * Get all itineraries for a specific group
     */
    async getGroupItineraries(groupId: number, userId: number): Promise<ItineraryListResponse[]> {
        try {
            // Check if user is a member of the group
            const isMember = await this.repository.isUserGroupMember(userId, groupId);
            if (!isMember) {
                throw new AppError("You must be a member of this group to view its itineraries", 403);
            }

            // Check if group exists
            const groupExists = await this.repository.groupExists(groupId);
            if (!groupExists) {
                throw new AppError("Group not found", 404);
            }

            const itineraries = await this.repository.getGroupItineraries(groupId);
            return itineraries.map(itinerary => this.mapToItineraryListResponse(itinerary));
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(`Failed to get group itineraries: ${error.message}`, 500);
        }
    }

    /**
     * Update an existing itinerary
     */
    async updateItinerary(itineraryId: number, data: ItineraryUpdateRequest, userId: number): Promise<ItineraryResponse> {
        try {
            // Check if itinerary exists
            const existingItinerary = await this.repository.getItineraryById(itineraryId);
            if (!existingItinerary) {
                throw new AppError("Itinerary not found", 404);
            }

            // Check if user has permission to update (must be leader of at least one group that has this itinerary)
            const hasPermission = await this.checkItineraryPermission(itineraryId, userId);
            if (!hasPermission) {
                throw new AppError("You don't have permission to update this itinerary", 403);
            }

            const updatedItinerary = await this.repository.updateItinerary(itineraryId, data);
            return this.mapToItineraryResponse(updatedItinerary);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(`Failed to update itinerary: ${error.message}`, 500);
        }
    }

    /**
     * Delete an itinerary
     */
    async deleteItinerary(itineraryId: number, userId: number): Promise<void> {
        try {
            // Check if itinerary exists
            const existingItinerary = await this.repository.getItineraryById(itineraryId);
            if (!existingItinerary) {
                throw new AppError("Itinerary not found", 404);
            }

            // Check if user has permission to delete
            const hasPermission = await this.checkItineraryPermission(itineraryId, userId);
            if (!hasPermission) {
                throw new AppError("You don't have permission to delete this itinerary", 403);
            }

            await this.repository.deleteItinerary(itineraryId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(`Failed to delete itinerary: ${error.message}`, 500);
        }
    }

    /**
     * Assign itinerary to a group
     */
    async assignItineraryToGroup(itineraryId: number, groupId: number, userId: number): Promise<GroupItineraryResponse> {
        try {
            // Check if user is the leader of the group
            const isLeader = await this.repository.isUserGroupLeader(userId, groupId);
            if (!isLeader) {
                throw new AppError("Only group leaders can assign itineraries", 403);
            }

            // Check if itinerary exists
            const itineraryExists = await this.repository.itineraryExists(itineraryId);
            if (!itineraryExists) {
                throw new AppError("Itinerary not found", 404);
            }

            // Check if group exists
            const groupExists = await this.repository.groupExists(groupId);
            if (!groupExists) {
                throw new AppError("Group not found", 404);
            }

            const groupItinerary = await this.repository.assignItineraryToGroup(itineraryId, groupId);
            return this.mapToGroupItineraryResponse(groupItinerary);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(`Failed to assign itinerary to group: ${error.message}`, 500);
        }
    }

    /**
     * Remove itinerary from a group
     */
    async removeItineraryFromGroup(itineraryId: number, groupId: number, userId: number): Promise<void> {
        try {
            // Check if user is the leader of the group
            const isLeader = await this.repository.isUserGroupLeader(userId, groupId);
            if (!isLeader) {
                throw new AppError("Only group leaders can remove itineraries", 403);
            }

            await this.repository.removeItineraryFromGroup(itineraryId, groupId);
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(`Failed to remove itinerary from group: ${error.message}`, 500);
        }
    }

    /**
     * Check if user has permission to modify itinerary
     * User must be a group leader (of any group)
     */
    private async checkItineraryPermission(itineraryId: number, userId: number): Promise<boolean> {
        try {
            // Check if user is a leader of any group
            const userGroups = await this.repository.getUserGroups(userId);
            return userGroups.length > 0; // If user is leader of any group, they can modify itineraries
        } catch (error) {
            return false;
        }
    }

    /**
     * Map Prisma Itinerary to ItineraryResponse
     */
    private mapToItineraryResponse(itinerary: any): ItineraryResponse {
        return {
            itinerary_id: itinerary.itinerary_id,
            title: itinerary.title || '',
            description: itinerary.description,
            start_date: itinerary.start_date.toISOString(),
            end_date: itinerary.end_date.toISOString(),
            place_links: itinerary.place_links || [],
            created_at: itinerary.created_at.toISOString(),
            updated_at: itinerary.updated_at.toISOString(),
            groups: itinerary.groups?.map((gi: any): GroupBasicInfo => ({
                group_id: gi.group.group_id,
                group_name: gi.group.group_name,
                description: gi.group.description,
                profile_url: gi.group.profile_url,
                max_members: gi.group.max_members,
                leader_name: `${gi.group.leader.first_name} ${gi.group.leader.last_name}`
            }))
        };
    }

    /**
     * Map Prisma Itinerary to ItineraryListResponse
     */
    private mapToItineraryListResponse(itinerary: any): ItineraryListResponse {
        return {
            itinerary_id: itinerary.itinerary_id,
            title: itinerary.title || '',
            description: itinerary.description,
            start_date: itinerary.start_date.toISOString(),
            end_date: itinerary.end_date.toISOString(),
            place_links: itinerary.place_links || [],
            created_at: itinerary.created_at.toISOString(),
            groups_count: itinerary._count?.groups || 0
        };
    }

    /**
     * Map Prisma GroupItinerary to GroupItineraryResponse
     */
    private mapToGroupItineraryResponse(groupItinerary: any): GroupItineraryResponse {
        return {
            id: groupItinerary.id,
            group_id: groupItinerary.group_id,
            itinerary_id: groupItinerary.itinerary_id,
            created_at: groupItinerary.created_at.toISOString(),
            group: {
                group_id: groupItinerary.group.group_id,
                group_name: groupItinerary.group.group_name,
                description: groupItinerary.group.description,
                profile_url: groupItinerary.group.profile_url,
                max_members: groupItinerary.group.max_members,
                leader_name: `${groupItinerary.group.leader.first_name} ${groupItinerary.group.leader.last_name}`
            },
            itinerary: this.mapToItineraryListResponse(groupItinerary.itinerary)
        };
    }
}