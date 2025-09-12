import { prisma } from "@/config/prismaClient";
import { Interest, TravelStyle } from "@/prisma/index";
import { int } from "zod";

export class InterestRepository {
    // Get all interests
    async getAllInterests(): Promise<Interest[]> {
        const interests = await prisma.interest.findMany({
        });
        return interests;
    }

    // Get interest by ID
    async getInterestById(id: number): Promise<Interest | null> {
        return await prisma.interest.findUnique({
            where: { id },
        });
    }

    // Get interest by key
    async getInterestByKey(key: string): Promise<Interest | null> {
        return await prisma.interest.findUnique({
            where: { key },
        });
    }

    // Create new interest
    async createInterest(data: Omit<Interest, 'id' | 'created_at' | 'updated_at'>): Promise<Interest> {
        return await prisma.interest.create({
            data,
        });
    }

    // Update interest
    async updateInterest(id: number, data: Partial<Omit<Interest, 'id' | 'created_at' | 'updated_at'>>): Promise<Interest> {
        return await prisma.interest.update({
            where: { id },
            data,
        });
    }

    // Delete interest
    async deleteInterest(id: number): Promise<Interest> {
        return await prisma.interest.delete({
            where: { id },
        });
    }

    // Get interests with user count
    async getInterestsWithUserCount(): Promise<(Interest & { userCount: number })[]> {
        const interests = await prisma.interest.findMany({
            include: {
                _count: {
                    select: { userInterests: true },
                },
            },
            orderBy: { key: 'asc' },
        });

        return interests.map(interest => ({
            ...interest,
            userCount: interest._count.userInterests,
        }));
    }
}

export class TravelStyleRepository {
    // Get all travel styles
    async getAllTravelStyles(): Promise<TravelStyle[]> {
        return await prisma.travelStyle.findMany({
            orderBy: { key: 'asc' },
        });
    }

    // Get travel style by ID
    async getTravelStyleById(id: number): Promise<TravelStyle | null> {
        return await prisma.travelStyle.findUnique({
            where: { id },
        });
    }

    // Get travel style by key
    async getTravelStyleByKey(key: string): Promise<TravelStyle | null> {
        return await prisma.travelStyle.findUnique({
            where: { key },
        });
    }

    // Create new travel style
    async createTravelStyle(data: Omit<TravelStyle, 'id' | 'created_at' | 'updated_at'>): Promise<TravelStyle> {
        return await prisma.travelStyle.create({
            data,
        });
    }

    // Update travel style
    async updateTravelStyle(id: number, data: Partial<Omit<TravelStyle, 'id' | 'created_at' | 'updated_at'>>): Promise<TravelStyle> {
        return await prisma.travelStyle.update({
            where: { id },
            data,
        });
    }

    // Delete travel style
    async deleteTravelStyle(id: number): Promise<TravelStyle> {
        return await prisma.travelStyle.delete({
            where: { id },
        });
    }

    // Get travel styles with user count
    async getTravelStylesWithUserCount(): Promise<(TravelStyle & { userCount: number })[]> {
        const travelStyles = await prisma.travelStyle.findMany({
            include: {
                _count: {
                    select: { userTravelStyles: true },
                },
            },
            orderBy: { key: 'asc' },
        });

        return travelStyles.map(travelStyle => ({
            ...travelStyle,
            userCount: travelStyle._count.userTravelStyles,
        }));
    }
}
