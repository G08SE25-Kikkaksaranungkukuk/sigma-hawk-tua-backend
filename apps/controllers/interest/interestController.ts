import { prisma } from "@/config/prismaClient";
import { Request, Response } from "express";
import { AppError } from "@/types/error/AppError";
import { BaseController } from "@/controllers/BaseController";

export class InterestController extends BaseController {
    async getAllInterests(req: Request, res: Response): Promise<void> {
        try {
            const interests = await prisma.interest.findMany();
            this.handleSuccess(res, interests, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }
}
