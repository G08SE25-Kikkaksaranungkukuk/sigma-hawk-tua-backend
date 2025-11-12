import { Request, Response } from 'express';
import { RatingService } from '../../services/rating/ratingService';
import { CreateRatingRequest, UpdateRatingRequest } from '../../types/rating/ratingTypes';
import { UserRepository } from '@/repository/User/userRepository';

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
      const email = req.params.userId;
      // lookup the user
      const userRepo = new UserRepository();
      const user = await userRepo.retrieveUser(email);

      if (!user) {
        res.status(404).json({ success: false, message: `User with email ${email} not found` });
        return;
      }

      // now you have numeric id for the rest of the function
      const userId = user.user_id;

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
      const email = req.params.userId;
      // lookup the user
      const userRepo = new UserRepository();
      const user = await userRepo.retrieveUser(email);

      if (!user) {
        res.status(404).json({ success: false, message: `User with email ${email} not found` });
        return;
      }

      // now you have numeric id for the rest of the function
      const userId = user.user_id;

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
      const email = req.params.userId;
      // lookup the user
      const userRepo = new UserRepository();
      const user = await userRepo.retrieveUser(email);

      if (!user) {
        res.status(404).json({ success: false, message: `User with email ${email} not found` });
        return;
      }

      // now you have numeric id for the rest of the function
      const userId = user.user_id;
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
      const email = req.params.userId;
      // lookup the user
      const userRepo = new UserRepository();
      const user = await userRepo.retrieveUser(email);

      if (!user) {
        res.status(404).json({ success: false, message: `User with email ${email} not found` });
        return;
      }

      // now you have numeric id for the rest of the function
      const userId = user.user_id;
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


}
