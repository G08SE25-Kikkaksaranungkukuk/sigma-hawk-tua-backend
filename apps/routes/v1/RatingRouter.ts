import { Router } from "express";
import express from "express";
import { RatingController } from "../../controllers/rating/ratingController";
import {
    validateRatingScores,
    preventSelfRating,
    rateLimitRating,
} from "../../middlewares/ratingMiddleware";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { BaseRouter } from "../baseRouter";

/**
 * Rating Router v1
 * Handles user rating endpoints for API version 1
 * Includes rating submission, updates, and statistics
 */
export class RatingRouterV1 extends BaseRouter {
    private readonly ratingController: RatingController;

    constructor() {
        super();
        this.ratingController = new RatingController();
        // Ensure JSON body parsing is available for this router
        this.router.use(express.json());
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Ensure JSON body parsing is available for this router
        this.router.use(express.json());

        // Public routes (no authentication required)
        // GET /user/:userId/rating - Get all ratings for user (public)
        this.router.get(
            "/user/:userId/rating",
            this.ratingController.getUserRating.bind(this.ratingController)
        );

        // Authenticated routes (require authentication)
        this.router.use(authMiddleware);

        // POST /user/:userId/rating - Submit/update rating for target user
        this.router.post(
            "/user/:userId/rating",
            validateRatingScores,
            preventSelfRating,
            rateLimitRating,
            this.ratingController.submitRating.bind(this.ratingController)
        );

        // PUT /user/:userId/rating - Update existing rating for target user
        this.router.put(
            "/user/:userId/rating",
            validateRatingScores,
            preventSelfRating,
            this.ratingController.updateRating.bind(this.ratingController)
        );

        // DELETE /user/:userId/rating - Delete rating for target user
        this.router.delete(
            "/user/:userId/rating",
            preventSelfRating,
            this.ratingController.deleteRating.bind(this.ratingController)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}
