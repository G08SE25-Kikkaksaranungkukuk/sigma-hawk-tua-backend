import { Router } from "express";
import { BaseRouter } from "../baseRouter";
import { ItineraryController } from "@/controllers/itinerary/itineraryController";
import { authMiddleware } from "@/middlewares/authMiddleware";

/**
 * Itinerary Router v2
 * Handles itinerary management endpoints for API version 2
 * Includes CRUD operations for itineraries and group-itinerary relationships
 */
export class ItineraryRouterV2 extends BaseRouter {
    private readonly itineraryController: ItineraryController;

    constructor() {
        super();
        this.itineraryController = new ItineraryController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Basic itinerary CRUD operations
        this.router.post(
            "/",
            authMiddleware,
            this.itineraryController.createItinerary.bind(this.itineraryController)
        );

        this.router.get(
            "/",
            authMiddleware,
            this.itineraryController.getAllItineraries.bind(this.itineraryController)
        );

        this.router.get(
            "/:itinerary_id",
            authMiddleware,
            this.itineraryController.getItineraryById.bind(this.itineraryController)
        );

        this.router.put(
            "/:itinerary_id",
            authMiddleware,
            this.itineraryController.updateItinerary.bind(this.itineraryController)
        );

        this.router.delete(
            "/:itinerary_id",
            authMiddleware,
            this.itineraryController.deleteItinerary.bind(this.itineraryController)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}

/**
 * Group Itinerary Router v2
 * Handles group-specific itinerary endpoints
 */
export class GroupItineraryRouterV2 extends BaseRouter {
    private readonly itineraryController: ItineraryController;

    constructor() {
        super();
        this.itineraryController = new ItineraryController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Group itinerary operations
        this.router.get(
            "/:group_id/itineraries",
            authMiddleware,
            this.itineraryController.getGroupItineraries.bind(this.itineraryController)
        );

        this.router.post(
            "/:group_id/itineraries/assign",
            authMiddleware,
            this.itineraryController.assignItineraryToGroup.bind(this.itineraryController)
        );

        this.router.delete(
            "/:group_id/itineraries/:itinerary_id",
            authMiddleware,
            this.itineraryController.removeItineraryFromGroup.bind(this.itineraryController)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}