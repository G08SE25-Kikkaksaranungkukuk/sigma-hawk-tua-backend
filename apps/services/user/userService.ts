import { Interest, User, TravelStyle } from "@/prisma/index";
import { UserRepository } from "@/repository/User/userRepository";
import { AppError } from "@/types/error/AppError";
import bcrypt from "bcrypt";

export class UserService {
    private repo: UserRepository;

    constructor() {
        this.repo = new UserRepository();
    }

    async getUser(email: string) {
        try {
            const user = await this.repo.getUserProfile(email);
            if (!user) {
                throw new AppError("User not found", 404);
            }
            return user;
        } catch (error: any) {
            throw new AppError(`Failed to fetch user: ${error.message}`, 500);
        }
    }

    async updateUser(email: string, data: Partial<User>) {
        try {
            if (!data) {
                throw new AppError("Invalid data: no data provided", 400);
            }

            const user = await this.repo.retrieveUser(email);
            if (!user) {
                throw new AppError("User not found", 404);
            }

            // Extract interests and travel_styles from data if they exist
            const { interests, travel_styles, ...userProfileData } = data as any;

            // Define allowed user profile fields (exclude system fields)
            const allowedFields = [
                "first_name", "middle_name", "last_name", 
                "birth_date", "sex", "phone", "profile_url"
            ];

            // Define fields that are allowed to be null or blank
            const allowedBlankFields = ["middle_name", "profile_url"];

            // Filter only allowed fields
            const filteredData: any = {};
            Object.entries(userProfileData).forEach(([key, value]) => {
                if (allowedFields.includes(key)) {
                    filteredData[key] = value;
                }
            });

            // Validate data, excluding allowed blank fields
            const invalidFields = Object.entries(filteredData).filter(
                ([key, value]) =>
                    !allowedBlankFields.includes(key) &&
                    (value == null ||
                        value === "" ||
                        (Array.isArray(value) && value.length === 0))
            );

            if (invalidFields.length > 0) {
                throw new AppError(
                    `Invalid data: contains null or empty values in fields: ${invalidFields
                        .map(([key]) => key)
                        .join(", ")}`,
                    400
                );
            }

            // Update user profile
            const updatedUser = await this.repo.updateUser(email, filteredData);

            // Handle interests update if provided
            if (interests && Array.isArray(interests)) {
                await this.repo.updateUserInterestsByKeys(email, interests);
            }

            // Handle travel styles update if provided
            if (travel_styles && Array.isArray(travel_styles)) {
                await this.repo.updateUserTravelStylesByKeys(email, travel_styles);
            }

            return updatedUser;
        } catch (error: any) {
            throw new AppError(`Failed to update user: ${error.message}`, 500);
        }
    }

    async DeleteUser(email: string, password: string){
        const userPassword = await this.repo.getUserPassword(email);

        const valid = await bcrypt.compare(password, userPassword);
        if (!valid) throw new AppError("Invalid password",401);

        await this.repo.Delete(email);
        };

    // Methods related to user interests

    async getAllTravelStyles() : Promise<Partial<TravelStyle>[]> {
        try {
            const travelStyles = await this.repo.getAllTravelStyles();
            return travelStyles;
        } catch (error : any) {
            throw new AppError(`Failed to fetch all travel styles: ${error.message}`, 500);
        }
    }

    async getAllInterests() : Promise<Partial<Interest>[]> {
        try {
            const interests = await this.repo.getAllInterests();
            return interests;
        } catch (error : any) {
            throw new AppError(`Failed to fetch all interests: ${error.message}`, 500);
        }
    }

    async getUserInterests(email: string) {
        try {
            const user = await this.repo.retrieveUser(email);
            if (!user) {
                throw new AppError("User not found", 404);
            }
            const interests = await this.repo.getUserInterestsByEmail(email);
            return interests;
        } catch (error: any) {
            throw new AppError(
                `Failed to fetch user interests: ${error.message}`,
                500
            );
        }
    }

    async updateUserInterests(email: string, interestIds: number[]) {
        try {
            const user = await this.repo.retrieveUser(email);
            if (!user) {
                throw new AppError("User not found", 404);
            }
            if (!Array.isArray(interestIds)) {
                throw new AppError("Interest IDs must be an array", 400);
            }
            return await this.repo.updateUserInterestsByEmail(
                email,
                interestIds
            );
        } catch (error: any) {
            throw new AppError(
                `Failed to update user interests: ${error.message}`,
                500
            );
        }
    }

    async uploadProfilePicture(email : string , pic : Express.Multer.File | undefined) : Promise<void> {
        try {
            const user = await this.repo.retrieveUser(email);
            if (!user) {
                throw new AppError("User not found", 404);
            }            await this.repo.updateUserProfile(user,pic);
        } catch (error : any) {
            throw new AppError(
                `Failed to upload new user profile: ${error.message}`,
                500
            );
        }
    }

    async getUserTravelStyles(email: string) {
        try {
            const travelStyles = await this.repo.getUserTravelStylesByEmail(email);
            return travelStyles;
        } catch (error: any) {
            throw new AppError(
                `Failed to fetch user travel styles: ${error.message}`,
                500
            );
        }
    }


    async updateUserTravelStyles(email: string, travelStyleIds: number[]) {
        try {
            const user = await this.repo.retrieveUser(email);
            if (!user) {
                throw new AppError("User not found", 404);
            }
            if (!Array.isArray(travelStyleIds)) {
                throw new AppError("Travel style IDs must be an array", 400);
            }
            return await this.repo.updateUserTravelStylesByEmail(
                email,
                travelStyleIds
            );
        } catch (error: any) {
            throw new AppError(
                `Failed to update user travel styles: ${error.message}`,
                500
            );
        }
    }
    
}
