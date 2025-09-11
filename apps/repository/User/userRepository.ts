import { authRegisterReq } from "@/types/auth/authRequest";
import { prisma } from "@/config/prismaClient";
import { Interest, User, TravelStyle } from "@/prisma/index";
import { AppError } from "@/types/error/AppError";
import axios from "axios";
import { config } from "@/config/config";
import { omit } from "zod/v4/core/util.cjs";
import { de, id } from "zod/v4/locales/index.cjs";
import { create } from "domain";

export class UserRepository {
    async createNewUser(payload: authRegisterReq): Promise<User> {
        // แยก interests และ travel_styles ออกจาก payload
        const { interests, travel_styles, ...userData } = payload;
        
        // สร้าง user ก่อน
        const user = await prisma.user.create({
            data: {
                ...userData,
                role: userData.role || 'USER'
            },
        });

        // จัดการ interests ถ้ามี
        if (interests && interests.length > 0) {
            // หา interest IDs จาก keys
            const interestRecords = await prisma.interest.findMany({
                where: {
                    key: { in: interests }
                }
            });

            // สร้าง UserInterest records
            if (interestRecords.length > 0) {
                await prisma.userInterest.createMany({
                    data: interestRecords.map(interest => ({
                        user_id: user.user_id,
                        interest_id: interest.id
                    }))
                });
            }
        }

        // จัดการ travel_styles ถ้ามี
        if (travel_styles && travel_styles.length > 0) {
            // หา travel style IDs จาก keys
            const travelStyleRecords = await prisma.travelStyle.findMany({
                where: {
                    key: { in: travel_styles }
                }
            });

            // สร้าง UserTravelStyle records
            if (travelStyleRecords.length > 0) {
                await prisma.userTravelStyle.createMany({
                    data: travelStyleRecords.map(travelStyle => ({
                        user_id: user.user_id,
                        travel_style_id: travelStyle.id
                    }))
                });
            }
        }

        return user;
    }

    async getAllTravelStyles() : Promise<Partial<TravelStyle>[]> {
        try {
            const travelStyles = await prisma.travelStyle.findMany({
                omit: {
                    id: true,
                    description: true,
                    created_at: true,
                    updated_at: true
                },
            });
            return travelStyles;
        } catch (error : any) {
            throw new AppError(`Failed to fetch all travel styles: ${error.message}`, 500);
        }
    }

    async getAllInterests() : Promise<Partial<Interest>[]> {
        try {
            const interests = await prisma.interest.findMany({
                omit: {
                    id: true,
                    description: true,
                    created_at: true,
                    updated_at: true
                },
        });
        return interests;
        } catch (error : any) {
            throw new AppError(`Failed to fetch all interests: ${error.message}`, 500);
        }
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

    async retrieveUserById(
    user_id: number,
    without_sentitive_fields: boolean = false
    ): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: { user_id },
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

    async updateUserProfile(user : User , image : Express.Multer.File | undefined): Promise<void>{
        if(!image) throw new AppError("Image is not uploaded",400)
        const file_ext = image.originalname.split(".").at(-1);
        const uploadPath = `/public/profile/${user.user_id}.${file_ext}`
        const ret = await axios.put(config.FILE_SERVER_URL + uploadPath,image.buffer);
        const userUpdated = await prisma.user.update({
            where : {"email" : user.email},
            data : {
                profile_url : {
                    set : uploadPath
                }
            }
        })
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

    // Update user interests by keys (string array)
    async updateUserInterestsByKeys(email: string, interestKeys: string[]) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { user_id: true },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Convert interest keys to IDs
        const interests = await prisma.interest.findMany({
            where: {
                key: { in: interestKeys }
            },
            select: { id: true }
        });

        const interestIds = interests.map(interest => interest.id);

        // Remove all existing interests for the user
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

    // Update user travel styles by keys (string array)
    async updateUserTravelStylesByKeys(email: string, travelStyleKeys: string[]) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { user_id: true },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Convert travel style keys to IDs
        const travelStyles = await prisma.travelStyle.findMany({
            where: {
                key: { in: travelStyleKeys }
            },
            select: { id: true }
        });

        const travelStyleIds = travelStyles.map(travelStyle => travelStyle.id);

        // Remove all existing travel styles for the user
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
}
