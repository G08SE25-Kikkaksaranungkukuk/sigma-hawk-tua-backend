import { Request, Response } from "express";
import { UserService } from "@/services/user/userService";
import { BaseController } from "@/controllers/BaseController";

export class UserController extends BaseController {
    private service: UserService;

    constructor() {
        super();
        this.service = new UserService();
    }

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            console.log("Request Body:", req.body);
            const email = req.params.email;
            console.log("Fetching user with email:", email);
            const user = await this.service.getUser(email);
            this.handleSuccess(res, { user }, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const email = req.body.email;
            const userData = req.body.data;

            const updatedUser = await this.service.updateUser(email, userData);
            this.handleSuccess(res, { user: updatedUser }, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async getInterests(req: Request, res: Response): Promise<void> {
        try {
            const email = req.body.email;
            const interests = await this.service.getUserInterests(email);
            this.handleSuccess(res, { email, interests }, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async patchInterests(req: Request, res: Response): Promise<void> {
        try {
            const email = req.body.email;
            const { interests } = req.body;

            const updated = await this.service.updateUserInterests(
                email,
                interests
            );
            this.handleSuccess(
                res,
                {
                    email: email,
                    updated,
                },
                200,
                "Interests updated"
            );
        } catch (error) {
            this.handleError(error, res);
        }
    }
}
