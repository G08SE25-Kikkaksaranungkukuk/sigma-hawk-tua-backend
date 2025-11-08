import { RatingRepository } from '../../repository/Rating/ratingRepository';
import { CreateRatingRequest, UpdateRatingRequest, SCORE_LIMITS } from '../../types/rating/ratingTypes';

export class RatingService {
  private ratingRepository: RatingRepository;

  constructor() {
    this.ratingRepository = new RatingRepository();
  }

  /**
   * Validate score values are within valid range (0-5)
   */
  private validateScores(scores: { trust_score?: number; engagement_score?: number; experience_score?: number }): void {
    const { trust_score, engagement_score, experience_score } = scores;
    
    if (trust_score !== undefined && (trust_score < SCORE_LIMITS.MIN_SCORE || trust_score > SCORE_LIMITS.MAX_SCORE)) {
      throw new Error(`Trust score must be between ${SCORE_LIMITS.MIN_SCORE} and ${SCORE_LIMITS.MAX_SCORE}`);
    }
    
    if (engagement_score !== undefined && (engagement_score < SCORE_LIMITS.MIN_SCORE || engagement_score > SCORE_LIMITS.MAX_SCORE)) {
      throw new Error(`Engagement score must be between ${SCORE_LIMITS.MIN_SCORE} and ${SCORE_LIMITS.MAX_SCORE}`);
    }
    
    if (experience_score !== undefined && (experience_score < SCORE_LIMITS.MIN_SCORE || experience_score > SCORE_LIMITS.MAX_SCORE)) {
      throw new Error(`Experience score must be between ${SCORE_LIMITS.MIN_SCORE} and ${SCORE_LIMITS.MAX_SCORE}`);
    }
  }

  /**
   * Submit or update a rating for a user
   */
  async submitRating(raterId: number, ratingData: CreateRatingRequest) {
    // Prevent self-rating
    if (raterId === ratingData.user_id) {
      throw new Error('Users cannot rate themselves');
    }

    // Validate score ranges
    this.validateScores(ratingData);

    try {
      const rating = await this.ratingRepository.upsertRating(raterId, ratingData);
      return {
        success: true,
        data: rating,
        message: 'Rating submitted successfully'
      };
    } catch (error) {
      throw new Error(`Failed to submit rating: ${(error as Error).message}`);
    }
  }

  /**
   * Get a specific rating between two users
   */
  async getUserRating(userId: number, raterId: number) {
    try {
      const rating = await this.ratingRepository.getRating(userId, raterId);
      
      if (!rating) {
        return {
          success: false,
          data: null,
          message: 'Rating not found'
        };
      }

      return {
        success: true,
        data: rating,
        message: 'Rating retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get rating: ${(error as Error).message}`);
    }
  }

  /**
   * Update an existing rating
   */
  async updateRating(userId: number, raterId: number, updateData: UpdateRatingRequest) {
    // Prevent self-rating
    if (raterId === userId) {
      throw new Error('Users cannot rate themselves');
    }

    // Validate score ranges
    this.validateScores(updateData);

    try {
      const rating = await this.ratingRepository.updateRating(userId, raterId, updateData);
      return {
        success: true,
        data: rating,
        message: 'Rating updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update rating: ${(error as Error).message}`);
    }
  }

  /**
   * Delete a rating
   */
  async deleteRating(userId: number, raterId: number) {
    // Prevent deletion by non-rater
    if (raterId === userId) {
      throw new Error('Invalid operation');
    }

    try {
      await this.ratingRepository.deleteRating(userId, raterId);
      return {
        success: true,
        data: null,
        message: 'Rating deleted successfully'
      };
    } catch (error) {
      throw new Error(`Failed to delete rating: ${(error as Error).message}`);
    }
  }

  /**
   * Get user rating statistics
   */
  async getUserRatingStats(userId: number) {
    try {
      const stats = await this.ratingRepository.getUserRatingStats(userId);
      return {
        success: true,
        data: stats,
        message: 'Rating statistics retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get rating statistics: ${(error as Error).message}`);
    }
  }

  /**
   * Check if a user has already rated another user
   */
  async checkIfUserRated(userId: number, raterId: number) {
    try {
      const hasRated = await this.ratingRepository.hasUserRated(userId, raterId);
      return {
        success: true,
        data: { has_rated: hasRated },
        message: hasRated ? 'User has already rated' : 'User has not rated yet'
      };
    } catch (error) {
      throw new Error(`Failed to check rating status: ${(error as Error).message}`);
    }
  }

  /**
   * Get all ratings given by a specific user
   */
  async getRatingsByRater(raterId: number) {
    try {
      const ratings = await this.ratingRepository.getRatingsByRater(raterId);
      return {
        success: true,
        data: ratings,
        message: 'Ratings retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get ratings by rater: ${(error as Error).message}`);
    }
  }

  /**
   * Get simple user ratings (scores + who voted)
   */
  async getSimpleUserRatings(userId: number) {
    try {
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('Invalid user ID');
      }
      
      const ratings = await this.ratingRepository.getRatingsForUser(userId);
      
      if (!ratings || ratings.length === 0) {
        return {
          success: true,
          data: {
            user_id: userId,
            total_ratings: 0,
            average_scores: null,
            ratings: []
          },
          message: 'No ratings found for this user'
        };
      }

      // Calculate averages
      const totalRatings = ratings.length;
      const avgTrust = ratings.reduce((sum, r) => sum + r.trust_score, 0) / totalRatings;
      const avgEngagement = ratings.reduce((sum, r) => sum + r.engagement_score, 0) / totalRatings;
      const avgExperience = ratings.reduce((sum, r) => sum + r.experience_score, 0) / totalRatings;
      const avgTotal = ratings.reduce((sum, r) => sum + r.total_score, 0) / totalRatings;

      // Format ratings with voter info
      const formattedRatings = ratings.map(rating => ({
        rater_id: rating.rater_id,
        trust_score: rating.trust_score,
        engagement_score: rating.engagement_score,
        experience_score: rating.experience_score,
        total_score: rating.total_score,
        created_at: rating.created_at,
        updated_at: rating.updated_at
      }));

      return {
        success: true,
        data: {
          user_id: userId,
          total_ratings: totalRatings,
          average_scores: {
            trust: Number(avgTrust.toFixed(2)),
            engagement: Number(avgEngagement.toFixed(2)),
            experience: Number(avgExperience.toFixed(2)),
            total: Number(avgTotal.toFixed(2))
          },
          ratings: formattedRatings
        },
        message: 'User ratings retrieved successfully'
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get user ratings: ${message}`);
    }
  }

  /**
   * Get all ratings received by a specific user
   */
  async getRatingsForUser(userId: number) {
    try {
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('Invalid user ID');
      }
      
      const ratings = await this.ratingRepository.getRatingsForUser(userId);
      return {
        success: true,
        data: ratings,
        message: 'Ratings retrieved successfully'
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get ratings for user: ${message}`);
    }
  }

  /**
   * Get detailed rating statistics with advanced analytics
   */
  async getDetailedUserRatingStats(userId: number) {
    try {
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error('Invalid user ID');
      }
      
      const stats = await this.ratingRepository.getDetailedUserRatingStats(userId);
      
      return {
        success: true,
        data: stats,
        message: 'Detailed rating statistics retrieved successfully'
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get detailed rating statistics: ${message}`);
    }
  }

  /**
   * Get top rated users leaderboard
   */
  async getTopRatedUsers(limit: number = 10) {
    try {
      if (!Number.isInteger(limit) || limit <= 0 || limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }
      
      const topUsers = await this.ratingRepository.getTopRatedUsers(limit);
      
      return {
        success: true,
        data: topUsers,
        message: 'Top rated users retrieved successfully'
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get top rated users: ${message}`);
    }
  }
}
