/**
 * Itinerary Data Transfer Objects
 * Defines clean data structures for API responses
 */

export interface ItineraryResponse {
    itinerary_id: number;
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    groups?: GroupBasicInfo[];
}

export interface ItineraryListResponse {
    itinerary_id: number;
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    created_at: string;
    groups_count: number;
}

export interface GroupBasicInfo {
    group_id: number;
    group_name: string;
    description?: string;
    profile_url?: string;
    max_members?: number;
    leader_name: string;
}

export interface GroupItineraryResponse {
    id: number;
    group_id: number;
    itinerary_id: number;
    created_at: string;
    group: GroupBasicInfo;
    itinerary: ItineraryListResponse;
}