import { Request, Response } from 'express';
import { RatingService } from '../../services/rating/ratingService';
import { CreateRatingRequest, UpdateRatingRequest } from '../../types/rating/ratingTypes';

export class RatingController {
  private ratingService: RatingService;

  constructor() {
    this.ratingService = new RatingService();
  }

  /**
   * Submit a rating for a user
   * POST /api/v1/user/:userId/rating
   */
  submitRating = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const raterId = req.user?.user_id; // From JWT middleware

      if (!raterId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated'
        });
        return;
      }

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const ratingData: CreateRatingRequest = {
        user_id: userId,
        trust_score: req.body.trust_score,
        engagement_score: req.body.engagement_score,
        experience_score: req.body.experience_score
      };

      const result = await this.ratingService.submitRating(raterId, ratingData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message
      });
    }
  };

  /**
   * Get all ratings for a user (simple format: scores + who voted)
   * GET /api/v1/user/:userId/rating
   */
  getUserRating = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const result = await this.ratingService.getSimpleUserRatings(userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message
      });
    }
  };

  /**
   * Update an existing rating
   * PUT /api/v1/user/:userId/rating
   */
  updateRating = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const raterId = req.user?.user_id; // From JWT middleware

      if (!raterId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated'
        });
        return;
      }

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const updateData: UpdateRatingRequest = {
        trust_score: req.body.trust_score,
        engagement_score: req.body.engagement_score,
        experience_score: req.body.experience_score
      };

      const result = await this.ratingService.updateRating(userId, raterId, updateData);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message
      });
    }
  };

  /**
   * Delete a rating
   * DELETE /api/v1/user/:userId/rating
   */
  deleteRating = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const raterId = req.user?.user_id; // From JWT middleware

      if (!raterId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated'
        });
        return;
      }

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const result = await this.ratingService.deleteRating(userId, raterId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message
      });
    }
  };

  /**
   * Get rating statistics for a user
   * GET /api/v1/user/:userId/rating/stats
   */
  getUserRatingStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const result = await this.ratingService.getUserRatingStats(userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message
      });
    }
  };

  /**
   * Check if the authenticated user has already rated the target user
   * GET /api/v1/user/:userId/rating/check
   */
  checkIfRated = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const raterId = req.user?.user_id; // From JWT middleware

      if (!raterId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated'
        });
        return;
      }

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const result = await this.ratingService.checkIfUserRated(userId, raterId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message
      });
    }
  };

  /**
   * Get all ratings received by a user
   * GET /api/v1/user/:userId/rating/all
   */
  getAllUserRatings = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const result = await this.ratingService.getRatingsForUser(userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message
      });
    }
  };

  /**
   * Get detailed rating statistics for a user
   * GET /api/v1/user/:userId/rating/detailed-stats
   */
  getDetailedUserRatingStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const result = await this.ratingService.getDetailedUserRatingStats(userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message
      });
    }
  };

  /**
   * Get top rated users leaderboard
   * GET /api/v1/rating/leaderboard?limit=10
   */
  getTopRatedUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.ratingService.getTopRatedUsers(limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message
      });
    }
  };
}
