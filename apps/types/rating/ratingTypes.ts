export interface CreateRatingRequest {
  user_id: number;
  trust_score: number;
  engagement_score: number;
  experience_score: number;
}

export interface UpdateRatingRequest {
  trust_score?: number;
  engagement_score?: number;
  experience_score?: number;
}

export interface RatingResponse {
  id: number;
  user_id: number;
  rater_id: number;
  trust_score: number;
  engagement_score: number;
  experience_score: number;
  total_score: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserRatingStats {
  user_id: number;
  average_trust_score: number;
  average_engagement_score: number;
  average_experience_score: number;
  average_total_score: number;
  total_ratings_count: number;
}

export const SCORE_WEIGHTS = {
  TRUST_WEIGHT: 0.4,      // α = 40%
  ENGAGEMENT_WEIGHT: 0.35, // β = 35%
  EXPERIENCE_WEIGHT: 0.25  // γ = 25%
} as const;

export const SCORE_LIMITS = {
  MIN_SCORE: 0,
  MAX_SCORE: 5
} as const;
