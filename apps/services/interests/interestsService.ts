import { AppError } from "@/types/error/AppError";
import { InterestsRepository } from "@/repository/interests/interestsRepository";

export class InterestsService {
    private interestsRepository: InterestsRepository;

    constructor() {
        this.interestsRepository = new InterestsRepository();
    }

    async getAllInterests() {
        try {
            return await this.interestsRepository.getAllInterests();
        } catch (error: unknown) {
            throw new AppError("Failed to get interests", 500);
        }
    }
}
            