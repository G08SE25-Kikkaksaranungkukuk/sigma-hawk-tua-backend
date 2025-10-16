/**
 * Itinerary Request Types
 * Defines the structure for incoming itinerary API requests
 */

export interface ItineraryCreateRequest {
    title: string;
    description?: string;
    start_date: string; // ISO date string
    end_date: string; // ISO date string
}

export interface ItineraryUpdateRequest {
    title?: string;
    description?: string;
    start_date?: string; // ISO date string
    end_date?: string; // ISO date string
}

export interface GroupItineraryAssignRequest {
    itinerary_id: number;
    group_id: number;
}