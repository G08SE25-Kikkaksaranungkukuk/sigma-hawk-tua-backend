import { InterestController } from "@/controllers/interest/interestController";
import { BaseRouter } from "./baseRouter";

export class InterestRouter extends BaseRouter {
    private interestController: InterestController;

    constructor() {
        super({ prefix: "" });
        this.interestController = new InterestController();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.get(
            "/",
            this.interestController.getAllInterests.bind(this.interestController)
        );
        // Add more endpoints here as needed
    }
}
