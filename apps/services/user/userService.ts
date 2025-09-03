import { Interest, User } from "@/prisma/index";
import { UserRepository } from "@/repository/User/userRepository";
import { AppError } from "@/types/error/AppError";

export class UserService {
    private repo: UserRepository;

    constructor() {
        this.repo = new UserRepository();
    }

    async getUser(email: string) {
        try {
            const user = await this.repo.retrieveUser(email);
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

    async updateUserInterests(_email: string, interests: Interest[]) {
        try {
            const user = await this.repo.retrieveUser(_email);
            if (!user) {
                throw new AppError("User not found", 404);
            }
            if (!Array.isArray(interests) || interests.length === 0) {
                throw new AppError("Interests must be a non-empty array", 400);
            }
            return await this.repo.updateUserInterestsByEmail(
                _email,
                interests
            );
        } catch (error: any) {
            throw new AppError(
                `Failed to update user interests: ${error.message}`,
                500
            );
        }
    }
}
