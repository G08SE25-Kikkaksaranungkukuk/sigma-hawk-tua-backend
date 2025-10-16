import { Request, Response } from "express";
import { BaseController } from "@/controllers/BaseController";
import { ItineraryService } from "@/services/itinerary/itineraryService";
import { 
    itineraryCreateSchema, 
    itineraryUpdateSchema,
    groupItineraryAssignSchema,
    itineraryParamsSchema,
    groupParamsSchema
} from "@/utils/itineraryValidation";

/**
 * Itinerary Controller
 * Handles HTTP requests and responses for itinerary-related operations
 */
export class ItineraryController extends BaseController {
    private readonly itineraryService: ItineraryService;

    constructor() {
        super();
        this.itineraryService = new ItineraryService();
    }

    /**
     * Create a new itinerary
     * POST /api/v2/itineraries
     */
    async createItinerary(req: Request, res: Response): Promise<void> {
        try {
            const userInfo = req.user;
            if (!userInfo) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
                return;
            }

            const validatedData = itineraryCreateSchema.parse(req.body);
            const itinerary = await this.itineraryService.createItinerary(validatedData);
            
            this.handleSuccess(res, itinerary, 201, "Itinerary created successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * Get itinerary by ID
     * GET /api/v2/itineraries/:itinerary_id
     */
    async getItineraryById(req: Request, res: Response): Promise<void> {
        try {
            const userInfo = req.user;
            if (!userInfo) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
                return;
            }

            const { itinerary_id } = itineraryParamsSchema.parse(req.params);
            const itinerary = await this.itineraryService.getItineraryById(parseInt(itinerary_id));
            
            this.handleSuccess(res, itinerary, 200, "Itinerary retrieved successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * Get all itineraries for a group
     * GET /api/v2/groups/:group_id/itineraries
     */
    async getGroupItineraries(req: Request, res: Response): Promise<void> {
        try {
            const userInfo = req.user;
            if (!userInfo) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
                return;
            }

            const { group_id } = groupParamsSchema.parse(req.params);
            const itineraries = await this.itineraryService.getGroupItineraries(
                parseInt(group_id), 
                userInfo.user_id
            );
            
            this.handleSuccess(res, itineraries, 200, "Group itineraries retrieved successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * Update an existing itinerary
     * PUT /api/v2/itineraries/:itinerary_id
     */
    async updateItinerary(req: Request, res: Response): Promise<void> {
        try {
            const userInfo = req.user;
            if (!userInfo) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
                return;
            }

            const { itinerary_id } = itineraryParamsSchema.parse(req.params);
            const validatedData = itineraryUpdateSchema.parse(req.body);
            
            const itinerary = await this.itineraryService.updateItinerary(
                parseInt(itinerary_id), 
                validatedData, 
                userInfo.user_id
            );
            
            this.handleSuccess(res, itinerary, 200, "Itinerary updated successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * Delete an itinerary
     * DELETE /api/v2/itineraries/:itinerary_id
     */
    async deleteItinerary(req: Request, res: Response): Promise<void> {
        try {
            const userInfo = req.user;
            if (!userInfo) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
                return;
            }

            const { itinerary_id } = itineraryParamsSchema.parse(req.params);
            
            await this.itineraryService.deleteItinerary(
                parseInt(itinerary_id), 
                userInfo.user_id
            );
            
            this.handleSuccess(res, null, 200, "Itinerary deleted successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * Assign itinerary to a group
     * POST /api/v2/groups/:group_id/itineraries/assign
     */
    async assignItineraryToGroup(req: Request, res: Response): Promise<void> {
        try {
            const userInfo = req.user;
            if (!userInfo) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
                return;
            }

            const { group_id } = groupParamsSchema.parse(req.params);
            const validatedData = groupItineraryAssignSchema.parse({
                ...req.body,
                group_id: parseInt(group_id)
            });
            
            const groupItinerary = await this.itineraryService.assignItineraryToGroup(
                validatedData.itinerary_id,
                validatedData.group_id,
                userInfo.user_id
            );
            
            this.handleSuccess(res, groupItinerary, 201, "Itinerary assigned to group successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * Remove itinerary from a group
     * DELETE /api/v2/groups/:group_id/itineraries/:itinerary_id
     */
    async removeItineraryFromGroup(req: Request, res: Response): Promise<void> {
        try {
            const userInfo = req.user;
            if (!userInfo) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
                return;
            }

            const { group_id } = groupParamsSchema.parse(req.params);
            const { itinerary_id } = itineraryParamsSchema.parse(req.params);
            
            await this.itineraryService.removeItineraryFromGroup(
                parseInt(itinerary_id),
                parseInt(group_id),
                userInfo.user_id
            );
            
            this.handleSuccess(res, null, 200, "Itinerary removed from group successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }
}