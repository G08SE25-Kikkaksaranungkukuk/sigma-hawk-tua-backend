import { InterestRepository, TravelStyleRepository } from "@/repository/Interest/interestRepository";
import { AppError } from "@/types/error/AppError";
import { Interest, TravelStyle } from "@/prisma/index";

export class InterestService {
    private repo: InterestRepository;

    constructor() {
        this.repo = new InterestRepository();
    }

    async getAllInterests() {
        try {
            return await this.repo.getAllInterests();
        } catch (error: any) {
            throw new AppError(
                `Failed to fetch interests: ${error.message}`,
                500
            );
        }
    }

    async getInterestById(id: number) {
        try {
            const interest = await this.repo.getInterestById(id);
            if (!interest) {
                throw new AppError("Interest not found", 404);
            }
            return interest;
        } catch (error: any) {
            throw new AppError(
                `Failed to fetch interest: ${error.message}`,
                500
            );
        }
    }

    async getInterestByKey(key: string) {
        try {
            const interest = await this.repo.getInterestByKey(key);
            if (!interest) {
                throw new AppError("Interest not found", 404);
            }
            return interest;
        } catch (error: any) {
            throw new AppError(
                `Failed to fetch interest: ${error.message}`,
                500
            );
        }
    }

    async createInterest(data: Omit<Interest, 'id' | 'created_at' | 'updated_at'>) {
        try {
            // Check if interest with same key already exists
            const existing = await this.repo.getInterestByKey(data.key);
            if (existing) {
                throw new AppError("Interest with this key already exists", 400);
            }
            return await this.repo.createInterest(data);
        } catch (error: any) {
            throw new AppError(
                `Failed to create interest: ${error.message}`,
                500
            );
        }
    }

    async updateInterest(id: number, data: Partial<Omit<Interest, 'id' | 'created_at' | 'updated_at'>>) {
        try {
            // Check if interest exists
            await this.getInterestById(id);
            
            // If updating key, check for duplicates
            if (data.key) {
                const existing = await this.repo.getInterestByKey(data.key);
                if (existing && existing.id !== id) {
                    throw new AppError("Interest with this key already exists", 400);
                }
            }
            
            return await this.repo.updateInterest(id, data);
        } catch (error: any) {
            throw new AppError(
                `Failed to update interest: ${error.message}`,
                500
            );
        }
    }

    async deleteInterest(id: number) {
        try {
            // Check if interest exists
            await this.getInterestById(id);
            return await this.repo.deleteInterest(id);
        } catch (error: any) {
            throw new AppError(
                `Failed to delete interest: ${error.message}`,
                500
            );
        }
    }

    async getInterestsWithUserCount() {
        try {
            return await this.repo.getInterestsWithUserCount();
        } catch (error: any) {
            throw new AppError(
                `Failed to fetch interests with user count: ${error.message}`,
                500
            );
        }
    }
}

export class TravelStyleService {
    private repo: TravelStyleRepository;

    constructor() {
        this.repo = new TravelStyleRepository();
    }

    async getAllTravelStyles() {
        try {
            return await this.repo.getAllTravelStyles();
        } catch (error: any) {
            throw new AppError(
                `Failed to fetch travel styles: ${error.message}`,
                500
            );
        }
    }

    async getTravelStyleById(id: number) {
        try {
            const travelStyle = await this.repo.getTravelStyleById(id);
            if (!travelStyle) {
                throw new AppError("Travel style not found", 404);
            }
            return travelStyle;
        } catch (error: any) {
            throw new AppError(
                `Failed to fetch travel style: ${error.message}`,
                500
            );
        }
    }

    async getTravelStyleByKey(key: string) {
        try {
            const travelStyle = await this.repo.getTravelStyleByKey(key);
            if (!travelStyle) {
                throw new AppError("Travel style not found", 404);
            }
            return travelStyle;
        } catch (error: any) {
            throw new AppError(
                `Failed to fetch travel style: ${error.message}`,
                500
            );
        }
    }

    async createTravelStyle(data: Omit<TravelStyle, 'id' | 'created_at' | 'updated_at'>) {
        try {
            // Check if travel style with same key already exists
            const existing = await this.repo.getTravelStyleByKey(data.key);
            if (existing) {
                throw new AppError("Travel style with this key already exists", 400);
            }
            return await this.repo.createTravelStyle(data);
        } catch (error: any) {
            throw new AppError(
                `Failed to create travel style: ${error.message}`,
                500
            );
        }
    }

    async updateTravelStyle(id: number, data: Partial<Omit<TravelStyle, 'id' | 'created_at' | 'updated_at'>>) {
        try {
            // Check if travel style exists
            await this.getTravelStyleById(id);
            
            // If updating key, check for duplicates
            if (data.key) {
                const existing = await this.repo.getTravelStyleByKey(data.key);
                if (existing && existing.id !== id) {
                    throw new AppError("Travel style with this key already exists", 400);
                }
            }
            
            return await this.repo.updateTravelStyle(id, data);
        } catch (error: any) {
            throw new AppError(
                `Failed to update travel style: ${error.message}`,
                500
            );
        }
    }

    async deleteTravelStyle(id: number) {
        try {
            // Check if travel style exists
            await this.getTravelStyleById(id);
            return await this.repo.deleteTravelStyle(id);
        } catch (error: any) {
            throw new AppError(
                `Failed to delete travel style: ${error.message}`,
                500
            );
        }
    }

    async getTravelStylesWithUserCount() {
        try {
            return await this.repo.getTravelStylesWithUserCount();
        } catch (error: any) {
            throw new AppError(
                `Failed to fetch travel styles with user count: ${error.message}`,
                500
            );
        }
    }
}
