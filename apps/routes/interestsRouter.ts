import { BaseRouter } from "./baseRouter";
import { InterestsController } from "@/controllers/interests/interestsController";

export class InterestsRouter extends BaseRouter {
    private controller: InterestsController;

    constructor() {
        super();
        this.controller = new InterestsController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get("/", this.controller.getAllInterests.bind(this.controller));
    }
}