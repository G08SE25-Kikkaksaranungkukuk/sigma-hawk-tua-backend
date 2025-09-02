import { Request, Response } from "express";
import { AppError } from "@/types/error/AppError";
import { UserService } from "@/services/user/userService";
import { Interest } from "@/prisma/index";
export class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    public getInterests = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const userId = Number(req.params.id);
            if (isNaN(userId)) {
                throw new AppError("Invalid user id", 400);
            }

            const interests = await this.service.getUserInterests(userId);
            res.status(200).json({ userId: userId, interests: interests });
        } catch (error: unknown) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }

            console.error("Unexpected error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    public patchInterests = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const userId = Number(req.params.id);
            if (isNaN(userId)) {
                throw new AppError("Invalid user id", 400);
            }

            const { interests } = req.body;
            if (!Array.isArray(interests)) {
                throw new AppError("Interests must be an array", 400);
            }

            const updated = await this.service.updateUserInterests(
                userId,
                interests
            );
            res.status(200).json({
                userId: userId,
                message: "Interests updated",
                updated,
            });
        } catch (error: unknown) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }

            console.error("Unexpected error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
}
