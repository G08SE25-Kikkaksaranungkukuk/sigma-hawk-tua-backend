import { Request, Response, NextFunction } from 'express';
import { SCORE_LIMITS } from '../types/rating/ratingTypes';
import { UserRepository } from '@/repository/User/userRepository';

/**
 * Middleware to validate rating scores are within valid range (0-5)
 */
export const validateRatingScores = (req: Request, res: Response, next: NextFunction): void => {
  // Skip validation for GET requests (no body needed)
  if (req.method === 'GET' || req.method === 'DELETE') {
    next();
    return;
  }

  // Debug logging
  console.log('🔍 Request method:', req.method);
  console.log('🔍 Request body:', req.body);
  console.log('🔍 Content-Type:', req.get('Content-Type'));

  // Check if req.body exists first
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    res.status(400).json({
      success: false,
      message: 'Request body is required and must be a valid JSON object'
    });
    return;
  }

  const { trust_score, engagement_score, experience_score } = req.body;

  // Check if at least one score is provided for updates
  if (req.method === 'PUT' && trust_score === undefined && engagement_score === undefined && experience_score === undefined) {
    res.status(400).json({
      success: false,
      message: 'At least one score must be provided for update'
    });
    return;
  }

  // For POST requests, all scores are required
  if (req.method === 'POST') {
    if (trust_score === undefined || engagement_score === undefined || experience_score === undefined) {
      res.status(400).json({
        success: false,
        message: 'All rating scores (trust_score, engagement_score, experience_score) are required'
      });
      return;
    }
  }

  // Validate trust_score
  if (trust_score !== undefined) {
    if (typeof trust_score !== 'number' || isNaN(trust_score) || trust_score < SCORE_LIMITS.MIN_SCORE || trust_score > SCORE_LIMITS.MAX_SCORE) {
      res.status(400).json({
        success: false,
        message: `Trust score must be a number between ${SCORE_LIMITS.MIN_SCORE} and ${SCORE_LIMITS.MAX_SCORE}`
      });
      return;
    }
  }

  // Validate engagement_score
  if (engagement_score !== undefined) {
    if (typeof engagement_score !== 'number' || isNaN(engagement_score) || engagement_score < SCORE_LIMITS.MIN_SCORE || engagement_score > SCORE_LIMITS.MAX_SCORE) {
      res.status(400).json({
        success: false,
        message: `Engagement score must be a number between ${SCORE_LIMITS.MIN_SCORE} and ${SCORE_LIMITS.MAX_SCORE}`
      });
      return;
    }
  }

  // Validate experience_score
  if (experience_score !== undefined) {
    if (typeof experience_score !== 'number' || isNaN(experience_score) || experience_score < SCORE_LIMITS.MIN_SCORE || experience_score > SCORE_LIMITS.MAX_SCORE) {
      res.status(400).json({
        success: false,
        message: `Experience score must be a number between ${SCORE_LIMITS.MIN_SCORE} and ${SCORE_LIMITS.MAX_SCORE}`
      });
      return;
    }
  }

  next();
};

/**
 * Middleware to validate user ID parameter
 */
export const validateUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userIdParam = req.params.userId;
  
  // Parse the userId parameter as a number
  const userId = parseInt(userIdParam, 10);

  if (isNaN(userId) || userId <= 0) {
    res.status(400).json({
      success: false,
      message: 'Valid user ID is required'
    });
    return;
  }

  // Verify the user exists in the database
  const userRepo = new UserRepository();
  const user = await userRepo.retrieveUserById(userId);

  if (!user) {
    res.status(404).json({ success: false, message: `User with ID ${userId} not found` });
    return;
  }

  next();
};

/**
 * Middleware to prevent self-rating
 */
export const preventSelfRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userIdParam = req.params.userId;
  
  // Parse the userId parameter as a number
  const userId = parseInt(userIdParam, 10);

  const raterId = req.user?.user_id;

  if (!raterId) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: User not authenticated'
    });
    return;
  }

  if (userId === raterId) {
    res.status(400).json({
      success: false,
      message: 'Users cannot rate themselves'
    });
    return;
  }

  next();
};

/**
 * Simple rate limiting for rating submissions
 * Prevents spam rating by the same user
 */
export const rateLimitRating = (() => {
  const ratingAttempts = new Map<string, { count: number; resetTime: number }>();
  const MAX_ATTEMPTS = 5; // Maximum 5 rating attempts per user per hour
  const RESET_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userIdParam = req.params.userId;
    
    // Parse the userId parameter as a number
    const userId = parseInt(userIdParam, 10);

    const userKey = `rating_${userId}`;
    const now = Date.now();
    const userAttempts = ratingAttempts.get(userKey);

    if (!userAttempts || now > userAttempts.resetTime) {
      // Reset or initialize attempts
      ratingAttempts.set(userKey, { count: 1, resetTime: now + RESET_TIME });
      next();
      return;
    }

    if (userAttempts.count >= MAX_ATTEMPTS) {
      res.status(429).json({
        success: false,
        message: 'Too many rating attempts. Please try again later.',
        retry_after: Math.ceil((userAttempts.resetTime - now) / 1000 / 60) // minutes
      });
      return;
    }

    // Increment attempt count
    userAttempts.count++;
    ratingAttempts.set(userKey, userAttempts);
    next();
  };
})();