import { authRegisterReq } from "@/types/auth/authRequest";
import { prisma } from "@/config/prismaClient";
import { Interest, User, TravelStyle } from "@/prisma/index";

export class UserRepository {
    async createNewUser(payload: authRegisterReq): Promise<User> {
        const user = await prisma.user.create({
            data: payload as User,
        });
        return user;
    }

    async findExistingUser(email: string): Promise<boolean> {
        const user = await prisma.user.findFirst({
            where: { email },
        });
        return user != null;
    }

    async retrieveUser(
        email: string,
        without_sentitive_fields: boolean = false
    ): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: { email },
            omit: {
                password: without_sentitive_fields,
                user_id: without_sentitive_fields,
                sex: without_sentitive_fields,
                social_credit: without_sentitive_fields,
                phone: without_sentitive_fields,
                birth_date: without_sentitive_fields,
            },
        });
        return user;
    }

    async getUserProfile(email: string): Promise<Partial<User> | null> {
        const user = await prisma.user.findFirst({
            where: { email },
            select: {
                first_name: true,
                middle_name: true,
                last_name: true,
                birth_date: true,
                sex: true,
                phone: true,
                profile_url: true,
                social_credit: true,
                userInterests: {
                    include: {
                        interest: true,
                    },
                },
                userTravelStyles: {
                    include: {
                        travel_style: true,
                    },
                },
            },
        });
        return user;
    }

    async updateUser(email: string, data: Partial<User>): Promise<User> {
        const updatedUser = await prisma.user.update({
            where: { email },
            data,
        });
        return updatedUser;
    }

    async getUserInterestsByEmail(email: string): Promise<Interest[]> {
        const user = await prisma.user.findFirst({
            where: { email },
            select: {
                userInterests: {
                    include: {
                        interest: true,
                    },
                },
            },
        });
        return user?.userInterests.map(ui => ui.interest) || [];
    }

    async updateUserInterestsByEmail(
        email: string,
        interestIds: number[]
    ): Promise<User> {
        // First, get the user ID
        const user = await prisma.user.findUnique({
            where: { email },
            select: { user_id: true },
        });

        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        // Remove existing interests
        await prisma.userInterest.deleteMany({
            where: { user_id: user.user_id },
        });

        // Add new interests
        if (interestIds.length > 0) {
            await prisma.userInterest.createMany({
                data: interestIds.map(interestId => ({
                    user_id: user.user_id,
                    interest_id: interestId,
                })),
            });
        }

        // Return updated user with interests
        const updatedUser = await prisma.user.findUnique({
            where: { email },
            include: {
                userInterests: {
                    include: {
                        interest: true,
                    },
                },
            },
        });

        return updatedUser!;
    }

    // New method to get user travel styles
    async getUserTravelStylesByEmail(email: string): Promise<TravelStyle[]> {
        const user = await prisma.user.findFirst({
            where: { email },
            select: {
                userTravelStyles: {
                    include: {
                        travel_style: true,
                    },
                },
            },
        });
        return user?.userTravelStyles.map(uts => uts.travel_style) || [];
    }

    // New method to update user travel styles
    async updateUserTravelStylesByEmail(
        email: string,
        travelStyleIds: number[]
    ): Promise<User> {
        // First, get the user ID
        const user = await prisma.user.findUnique({
            where: { email },
            select: { user_id: true },
        });

        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        // Remove existing travel styles
        await prisma.userTravelStyle.deleteMany({
            where: { user_id: user.user_id },
        });

        // Add new travel styles
        if (travelStyleIds.length > 0) {
            await prisma.userTravelStyle.createMany({
                data: travelStyleIds.map(travelStyleId => ({
                    user_id: user.user_id,
                    travel_style_id: travelStyleId,
                })),
            });
        }

        // Return updated user with travel styles
        const updatedUser = await prisma.user.findUnique({
            where: { email },
            include: {
                userTravelStyles: {
                    include: {
                        travel_style: true,
                    },
                },
            },
        });

        return updatedUser!;
    }

    // Utility method to add a single interest to a user
    async addUserInterest(email: string, interestId: number): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { user_id: true },
        });

        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        // Use upsert to avoid duplicate entries
        await prisma.userInterest.upsert({
            where: {
                user_id_interest_id: {
                    user_id: user.user_id,
                    interest_id: interestId,
                },
            },
            update: {},
            create: {
                user_id: user.user_id,
                interest_id: interestId,
            },
        });
    }

    // Utility method to remove a single interest from a user
    async removeUserInterest(email: string, interestId: number): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { user_id: true },
        });

        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        await prisma.userInterest.deleteMany({
            where: {
                user_id: user.user_id,
                interest_id: interestId,
            },
        });
    }

    // Utility method to add a single travel style to a user
    async addUserTravelStyle(email: string, travelStyleId: number): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { user_id: true },
        });

        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        // Use upsert to avoid duplicate entries
        await prisma.userTravelStyle.upsert({
            where: {
                user_id_travel_style_id: {
                    user_id: user.user_id,
                    travel_style_id: travelStyleId,
                },
            },
            update: {},
            create: {
                user_id: user.user_id,
                travel_style_id: travelStyleId,
            },
        });
    }

    // Utility method to remove a single travel style from a user
    async removeUserTravelStyle(email: string, travelStyleId: number): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { user_id: true },
        });

        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        await prisma.userTravelStyle.deleteMany({
            where: {
                user_id: user.user_id,
                travel_style_id: travelStyleId,
            },
        });
    }

    // Method to get full user profile with interests and travel styles
    async getFullUserProfile(email: string) {
        const user = await prisma.user.findFirst({
            where: { email },
            include: {
                userInterests: {
                    include: {
                        interest: true,
                    },
                },
                userTravelStyles: {
                    include: {
                        travel_style: true,
                    },
                },
            },
        });

        if (!user) return null;

        // Transform the data to a cleaner format
        return {
            ...user,
            interests: user.userInterests.map(ui => ui.interest),
            travel_styles: user.userTravelStyles.map(uts => uts.travel_style),
        };
    }
}
