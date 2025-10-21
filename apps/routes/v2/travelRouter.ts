import { Router } from "express";
import { BaseRouter } from "../baseRouter";
import { TravelController } from "@/controllers/travel/travelController";
import { travelMiddleware } from "@/middlewares/travelMiddleware";

/**
 * Travel Router v2
 * Handles travel history endpoints for authenticated users.
 * Provides access to the user's travel history.
 */

export class TravelRouterV2 extends BaseRouter {

    private readonly travelController: TravelController;

    constructor() {
        super();
        this.travelController = new TravelController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Profile management

        this.router.get(
            "/me",
            travelMiddleware,
            this.travelController.getTravelHistory.bind(this.travelController)
        );

    }

    public getRouter(): Router {
        return this.router;
    }
}