import { z } from "zod";

/**
 * Validation schemas for itinerary requests
 */

export const itineraryCreateSchema = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(200, "Title must be less than 200 characters"),
    description: z.string()
        .max(1000, "Description must be less than 1000 characters")
        .optional(),
    start_date: z.string()
        .datetime("Invalid start date format. Use ISO 8601 format"),
    end_date: z.string()
        .datetime("Invalid end date format. Use ISO 8601 format"),
    place_links: z.array(z.string().url("Invalid URL format"))
        .optional()
        .default([])
}).refine(data => {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return startDate < endDate;
}, {
    message: "End date must be after start date",
    path: ["end_date"]
});

export const itineraryUpdateSchema = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(200, "Title must be less than 200 characters")
        .optional(),
    description: z.string()
        .max(1000, "Description must be less than 1000 characters")
        .optional(),
    start_date: z.string()
        .datetime("Invalid start date format. Use ISO 8601 format")
        .optional(),
    end_date: z.string()
        .datetime("Invalid end date format. Use ISO 8601 format")
        .optional(),
    place_links: z.array(z.string().url("Invalid URL format"))
        .optional()
}).refine(data => {
    if (data.start_date && data.end_date) {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        return startDate < endDate;
    }
    return true;
}, {
    message: "End date must be after start date",
    path: ["end_date"]
});

export const groupItineraryAssignSchema = z.object({
    itinerary_id: z.number().int().positive("Invalid itinerary ID"),
    group_id: z.number().int().positive("Invalid group ID")
});

export const itineraryParamsSchema = z.object({
    itinerary_id: z.string().regex(/^\d+$/, "Invalid itinerary ID")
});

export const groupParamsSchema = z.object({
    group_id: z.string().regex(/^\d+$/, "Invalid group ID")
});

export type ItineraryCreateRequest = z.infer<typeof itineraryCreateSchema>;
export type ItineraryUpdateRequest = z.infer<typeof itineraryUpdateSchema>;
export type GroupItineraryAssignRequest = z.infer<typeof groupItineraryAssignSchema>;