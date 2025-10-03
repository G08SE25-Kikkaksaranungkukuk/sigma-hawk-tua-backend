import { Router } from "express";

export class RouterManager {
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeRouters();
    }

    private initializeRouters(): void {}

    public getRouter(): Router {
        return this.router;
    }
}
