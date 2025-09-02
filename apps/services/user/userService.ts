import { Interest } from "@/prisma/index";
import { UserRepository } from "@/repository/User/userRepository";

export class UserService {
    private repo: UserRepository;

    constructor() {
        this.repo = new UserRepository();
    }

    // Methods related to user interests
    public async getUserInterests(userId: number) {
        return this.repo.findUserInterests(userId);
    }

    public async updateUserInterests(userId: number, interests: Interest[]) {
        return this.repo.updateUserInterests(userId, interests);
    }
}
