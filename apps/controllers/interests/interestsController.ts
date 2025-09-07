import { Request, Response } from "express";
import { BaseController } from "@/controllers/BaseController";
import { InterestService } from "@/services/InterestService"; // Adjust path as needed

export class InterestsController extends BaseController {
    private interestService: InterestService;

    constructor() {
        super();
        this.interestService = new InterestService();
    }

    async getAllInterests(req: Request, res: Response): Promise<void> {
        try {
            const interestsList = await this.interestService.getAllInterests();
            this.handleSuccess(res, { interests: interestsList }, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }
}