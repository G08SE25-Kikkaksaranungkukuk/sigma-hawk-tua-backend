import { Itinerary, GroupItinerary } from "@/prisma/index";
import { ItineraryCreateRequest, ItineraryUpdateRequest } from "@/types/itinerary/itineraryRequest";
import { 
    ItineraryResponse, 
    ItineraryListResponse, 
    GroupItineraryResponse 
} from "@/types/itinerary/itineraryDTOs";

/**
 * Itinerary Service Interface
 * Defines the contract for itinerary-related business operations
 * Following Clean Architecture's Dependency Inversion Principle
 */
export interface IItineraryService {
    /**
     * Create a new itinerary
     */
    createItinerary(data: ItineraryCreateRequest): Promise<ItineraryResponse>;

    /**
     * Get itinerary by ID with full details
     */
    getItineraryById(itineraryId: number): Promise<ItineraryResponse>;

    /**
     * Get all itineraries for a specific group
     */
    getGroupItineraries(groupId: number, userId: number): Promise<ItineraryListResponse[]>;

    /**
     * Update an existing itinerary
     * Only group leaders can update itineraries
     */
    updateItinerary(itineraryId: number, data: ItineraryUpdateRequest, userId: number): Promise<ItineraryResponse>;

    /**
     * Delete an itinerary
     * Only group leaders can delete itineraries
     */
    deleteItinerary(itineraryId: number, userId: number): Promise<void>;

    /**
     * Assign itinerary to a group
     * Only group leaders can assign itineraries
     */
    assignItineraryToGroup(itineraryId: number, groupId: number, userId: number): Promise<GroupItineraryResponse>;

    /**
     * Remove itinerary from a group
     * Only group leaders can remove itineraries
     */
    removeItineraryFromGroup(itineraryId: number, groupId: number, userId: number): Promise<void>;
}