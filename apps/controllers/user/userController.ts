import { Request, Response } from "express";
import { AppError } from "@/types/error/AppError";
import { UserService } from "@/services/user/userService";
import { Interest } from "@/prisma/index";
export class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    async getInterests(req: Request, res: Response): Promise<void> {
        try {
            const _email = req.body._email;
            const interests = await this.service.getUserInterests(_email);
            res.status(200).json({ _email: _email, interests: interests });
        } catch (error: unknown) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
                return;
            }

            console.error("Unexpected error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async patchInterests(req: Request, res: Response): Promise<void> {
        try {
            const _email = req.body._email;
            const { interests } = req.body;

            const updated = await this.service.updateUserInterests(
                _email,
                interests
            );
            res.status(200).json({
                _email: _email,
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
    }
}
