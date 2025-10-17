import { Request, Response } from "express";
import { BaseController } from "@/controllers/BaseController";
import { TravelService } from "@/services/travel/travelService";

export class TravelController extends BaseController {
    private travelService : TravelService;

    constructor() {
        super();
        this.travelService = new TravelService();
    }

    async getTravelHistory(req : Request , res : Response) : Promise<void> {

        try {
            if(req.user) {
                this.handleSuccess(res,await this.travelService.getTravelHistory(req.user?.user_id),200)
            }
        }
        catch (err){
            this.handleError(err,res);
        }
    }
}
