import { Router } from "express";
import { RouterManager } from "@/v1/routes/RouterManager";

export class VersionControl {
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeRouters();
    }

    private initializeRouters(): void {
        const routerManager = new RouterManager();
        this.router.use("/v1", routerManager.getRouter());
    }

    public getRouter(): Router {
        return this.router;
    }
}
