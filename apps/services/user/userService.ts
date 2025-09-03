import { Interest } from "@/prisma/index";
import { UserRepository } from "@/repository/User/userRepository";
import { AppError } from "@/types/error/AppError";

export class UserService {
    private repo: UserRepository;

    constructor() {
        this.repo = new UserRepository();
    }

    // Methods related to user interests
    async getUserInterests(_email: string) {
        try {
            const user = await this.repo.retrieveUser(_email);
            if (!user) {
                throw new AppError("User not found", 404);
            }
            const interests = await this.repo.getUserInterestsByEmail(_email);
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
