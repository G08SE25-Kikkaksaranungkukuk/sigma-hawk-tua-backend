import { Interest, User, TravelStyle } from "@/prisma/index";
import { UserRepository } from "@/repository/User/userRepository";
import { AppError } from "@/types/error/AppError";

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

            // Define fields that are allowed to be null or blank
            const allowedBlankFields = ["middle_name", "profile_url"];

            // Validate data, excluding allowed blank fields
            const invalidFields = Object.entries(data).filter(
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

            const user = await this.repo.retrieveUser(email);
            if (!user) {
                throw new AppError("User not found", 404);
            }

            // Merge existing user data with the new data
            const updatedData = { ...user, ...data };
            return await this.repo.updateUser(email, updatedData);
        } catch (error: any) {
            throw new AppError(`Failed to update user: ${error.message}`, 500);
        }
    }

    // Methods related to user interests
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

    async getUserTravelStyles(email: string) {
        try {
            const user = await this.repo.retrieveUser(email);
            if (!user) {
                throw new AppError("User not found", 404);
            }
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
