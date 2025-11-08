import { PrismaClient } from '../../../generated/prisma';
import { CreateRatingRequest, UpdateRatingRequest, UserRatingStats, SCORE_WEIGHTS } from '../../types/rating/ratingTypes';

const prisma = new PrismaClient();

export class RatingRepository {
  /**
   * Calculate total score using weighted formula: TK = α(Trust) + β(Engagement) + γ(Experience)
   */
  private calculateTotalScore(trustScore: number, engagementScore: number, experienceScore: number): number {
    const totalScore = 
      (SCORE_WEIGHTS.TRUST_WEIGHT * trustScore) +
      (SCORE_WEIGHTS.ENGAGEMENT_WEIGHT * engagementScore) +
      (SCORE_WEIGHTS.EXPERIENCE_WEIGHT * experienceScore);
    
    return Math.round(totalScore * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Create or update a rating (upsert operation)
   * และ recalculate average scores สำหรับ user ที่ถูกให้คะแนน
   */
  async upsertRating(raterId: number, createData: CreateRatingRequest) {
    // คำนวณ total score ของ rating นี้
    const totalScore = this.calculateTotalScore(
      createData.trust_score,
      createData.engagement_score,
      createData.experience_score
    );

    // บันทึก rating ลงฐานข้อมูล
    const rating = await prisma.rating.upsert({
      where: {
        user_id_rater_id: {
          user_id: createData.user_id,
          rater_id: raterId
        }
      },
      update: {
        trust_score: createData.trust_score,
        engagement_score: createData.engagement_score,
        experience_score: createData.experience_score,
        total_score: totalScore,
        updated_at: new Date()
      },
      create: {
        user_id: createData.user_id,
        rater_id: raterId,
        trust_score: createData.trust_score,
        engagement_score: createData.engagement_score,
        experience_score: createData.experience_score,
        total_score: totalScore
      }
    });

    // คำนวณและอัปเดต average scores ใหม่ในฐานข้อมูล
    await this.updateUserAverageScores(createData.user_id);

    return rating;
  }

  /**
   * อัปเดต aggregate scores ของ user ในฐานข้อมูล
   * เรียกใช้ทุกครั้งที่มีการเพิ่ม/แก้ไข/ลบ rating
   */
  async updateUserAverageScores(userId: number): Promise<void> {
    // ดึง ratings ทั้งหมดของ user นี้
    const ratings = await prisma.rating.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    if (ratings.length === 0) {
      // ถ้าไม่มี ratings ให้ลบ aggregate record
      await prisma.userRatingAggregate.deleteMany({
        where: { user_id: userId }
      });
      return;
    }

    // คำนวณค่าเฉลี่ย
    const avgTrust = ratings.reduce((sum, r) => sum + r.trust_score, 0) / ratings.length;
    const avgEngagement = ratings.reduce((sum, r) => sum + r.engagement_score, 0) / ratings.length;
    const avgExperience = ratings.reduce((sum, r) => sum + r.experience_score, 0) / ratings.length;
    const avgTotal = ratings.reduce((sum, r) => sum + r.total_score, 0) / ratings.length;

    // คำนวณ median
    const trustScores = ratings.map(r => r.trust_score).sort((a, b) => a - b);
    const engagementScores = ratings.map(r => r.engagement_score).sort((a, b) => a - b);
    const experienceScores = ratings.map(r => r.experience_score).sort((a, b) => a - b);
    const totalScores = ratings.map(r => r.total_score).sort((a, b) => a - b);

    const getMedian = (arr: number[]) => {
      const mid = Math.floor(arr.length / 2);
      return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    };

    // คำนวณ min/max
    const minTotal = Math.min(...totalScores);
    const maxTotal = Math.max(...totalScores);

    // อัปเดตหรือสร้าง aggregate record
    await prisma.userRatingAggregate.upsert({
      where: { user_id: userId },
      update: {
        average_trust_score: Math.round(avgTrust * 100) / 100,
        average_engagement_score: Math.round(avgEngagement * 100) / 100,
        average_experience_score: Math.round(avgExperience * 100) / 100,
        average_total_score: Math.round(avgTotal * 100) / 100,
        median_trust_score: Math.round(getMedian(trustScores) * 100) / 100,
        median_engagement_score: Math.round(getMedian(engagementScores) * 100) / 100,
        median_experience_score: Math.round(getMedian(experienceScores) * 100) / 100,
        median_total_score: Math.round(getMedian(totalScores) * 100) / 100,
        min_total_score: minTotal,
        max_total_score: maxTotal,
        total_ratings_count: ratings.length,
        last_updated: new Date()
      },
      create: {
        user_id: userId,
        average_trust_score: Math.round(avgTrust * 100) / 100,
        average_engagement_score: Math.round(avgEngagement * 100) / 100,
        average_experience_score: Math.round(avgExperience * 100) / 100,
        average_total_score: Math.round(avgTotal * 100) / 100,
        median_trust_score: Math.round(getMedian(trustScores) * 100) / 100,
        median_engagement_score: Math.round(getMedian(engagementScores) * 100) / 100,
        median_experience_score: Math.round(getMedian(experienceScores) * 100) / 100,
        median_total_score: Math.round(getMedian(totalScores) * 100) / 100,
        min_total_score: minTotal,
        max_total_score: maxTotal,
        total_ratings_count: ratings.length
      }
    });
  }
  async getRating(userId: number, raterId: number) {
    return await prisma.rating.findUnique({
      where: {
        user_id_rater_id: {
          user_id: userId,
          rater_id: raterId
        }
      }
    });
  }

  /**
   * Update an existing rating และอัปเดต aggregate
   */
  async updateRating(userId: number, raterId: number, updateData: UpdateRatingRequest) {
    const existingRating = await this.getRating(userId, raterId);
    if (!existingRating) {
      throw new Error('Rating not found');
    }

    const newTrustScore = updateData.trust_score ?? existingRating.trust_score;
    const newEngagementScore = updateData.engagement_score ?? existingRating.engagement_score;
    const newExperienceScore = updateData.experience_score ?? existingRating.experience_score;

    const totalScore = this.calculateTotalScore(newTrustScore, newEngagementScore, newExperienceScore);

    const rating = await prisma.rating.update({
      where: {
        user_id_rater_id: {
          user_id: userId,
          rater_id: raterId
        }
      },
      data: {
        trust_score: newTrustScore,
        engagement_score: newEngagementScore,
        experience_score: newExperienceScore,
        total_score: totalScore,
        updated_at: new Date()
      }
    });

    // อัปเดต aggregate scores
    await this.updateUserAverageScores(userId);

    return rating;
  }

  /**
   * Delete a rating และอัปเดต aggregate
   */
  async deleteRating(userId: number, raterId: number) {
    const rating = await prisma.rating.delete({
      where: {
        user_id_rater_id: {
          user_id: userId,
          rater_id: raterId
        }
      }
    });

    // อัปเดต aggregate scores หลังจากลบ
    await this.updateUserAverageScores(userId);

    return rating;
  }

  /**
   * Get user rating statistics (อ่านจาก aggregate table สำหรับความเร็ว)
   * Enhanced version with pre-calculated statistics from database
   */
  async getUserRatingStats(userId: number): Promise<UserRatingStats> {
    // อ่านจาก aggregate table ที่คำนวณไว้แล้ว
    const aggregate = await prisma.userRatingAggregate.findUnique({
      where: { user_id: userId }
    });

    if (!aggregate) {
      return {
        user_id: userId,
        average_trust_score: 0,
        average_engagement_score: 0,
        average_experience_score: 0,
        average_total_score: 0,
        total_ratings_count: 0
      };
    }

    return {
      user_id: userId,
      average_trust_score: aggregate.average_trust_score,
      average_engagement_score: aggregate.average_engagement_score,
      average_experience_score: aggregate.average_experience_score,
      average_total_score: aggregate.average_total_score,
      total_ratings_count: aggregate.total_ratings_count
    };
  }

  /**
   * Check if a user has already rated another user
   */
  async hasUserRated(userId: number, raterId: number): Promise<boolean> {
    const rating = await this.getRating(userId, raterId);
    return rating !== null;
  }

  /**
   * Get all ratings given by a specific rater
   */
  async getRatingsByRater(raterId: number) {
    return await prisma.rating.findMany({
      where: { rater_id: raterId },
      orderBy: { created_at: 'desc' }
    });
  }

  /**
   * Get all ratings received by a specific user
   */
  async getRatingsForUser(userId: number) {
    return await prisma.rating.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
  }

  /**
   * Get detailed rating statistics with more insights (อ่านจาก aggregate table)
   */
  async getDetailedUserRatingStats(userId: number) {
    // อ่านจาก aggregate table
    const aggregate = await prisma.userRatingAggregate.findUnique({
      where: { user_id: userId }
    });

    // ดึง latest ratings 5 อันล่าสุด
    const latestRatings = await prisma.rating.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    if (!aggregate || aggregate.total_ratings_count === 0) {
      return {
        user_id: userId,
        total_ratings_count: 0,
        averages: {
          trust_score: 0,
          engagement_score: 0,
          experience_score: 0,
          total_score: 0
        },
        median: {
          trust_score: 0,
          engagement_score: 0,
          experience_score: 0,
          total_score: 0
        },
        range: {
          trust_min: 0, trust_max: 0,
          engagement_min: 0, engagement_max: 0,
          experience_min: 0, experience_max: 0,
          total_min: 0, total_max: 0
        },
        latest_ratings: [],
        last_updated: new Date()
      };
    }

    // คำนวณ min/max สำหรับ trust, engagement, experience
    const allRatings = await prisma.rating.findMany({
      where: { user_id: userId },
      select: {
        trust_score: true,
        engagement_score: true,
        experience_score: true
      }
    });

    const trustScores = allRatings.map(r => r.trust_score);
    const engagementScores = allRatings.map(r => r.engagement_score);
    const experienceScores = allRatings.map(r => r.experience_score);

    return {
      user_id: userId,
      total_ratings_count: aggregate.total_ratings_count,
      averages: {
        trust_score: aggregate.average_trust_score,
        engagement_score: aggregate.average_engagement_score,
        experience_score: aggregate.average_experience_score,
        total_score: aggregate.average_total_score
      },
      median: {
        trust_score: aggregate.median_trust_score,
        engagement_score: aggregate.median_engagement_score,
        experience_score: aggregate.median_experience_score,
        total_score: aggregate.median_total_score
      },
      range: {
        trust_min: Math.min(...trustScores),
        trust_max: Math.max(...trustScores),
        engagement_min: Math.min(...engagementScores),
        engagement_max: Math.max(...engagementScores),
        experience_min: Math.min(...experienceScores),
        experience_max: Math.max(...experienceScores),
        total_min: aggregate.min_total_score,
        total_max: aggregate.max_total_score
      },
      latest_ratings: latestRatings,
      last_updated: aggregate.last_updated
    };
  }

  /**
   * Get top rated users (leaderboard) จาก aggregate table
   */
  async getTopRatedUsers(limit: number = 10) {
    const topUsers = await prisma.userRatingAggregate.findMany({
      where: {
        total_ratings_count: {
          gte: 1 // มีการให้คะแนนอย่างน้อย 1 ครั้ง
        }
      },
      orderBy: {
        average_total_score: 'desc'
      },
      take: limit
    });

    return topUsers.map(user => ({
      user_id: user.user_id,
      average_total_score: user.average_total_score,
      average_trust_score: user.average_trust_score,
      average_engagement_score: user.average_engagement_score,
      average_experience_score: user.average_experience_score,
      total_ratings: user.total_ratings_count,
      last_updated: user.last_updated
    }));
  }
}
