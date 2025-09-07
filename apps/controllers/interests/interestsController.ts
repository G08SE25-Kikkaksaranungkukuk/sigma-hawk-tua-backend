import { Request, Response } from "express";
import { BaseController } from "@/controllers/BaseController";
import { InterestsService } from "@/services/interests/interestsService";

export class InterestsController extends BaseController {
    private interestService: InterestsService;

    constructor() {
        super();
        this.interestService = new InterestsService();
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