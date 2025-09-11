import { Request, Response } from "express";
import { UserService } from "@/services/user/userService";
import { BaseController } from "@/controllers/BaseController";
import { verifyJwt } from "@/utils/jwt";
import { config } from "@/config/config";
import { User } from "@/prisma/index";

export class UserController extends BaseController {
    private service: UserService;

    constructor() {
        super();
        this.service = new UserService();
    }

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const email = req.body.email;
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
            this.handleSuccess(res, {
                email: email,
                updated
            }, 200, "Interests updated");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async getTravelStyles(req: Request, res: Response): Promise<void> {
        try {
            const email = req.body.email;
            const travelStyles = await this.service.getUserTravelStyles(email);
            this.handleSuccess(res, { email, travelStyles }, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async patchTravelStyles(req: Request, res: Response): Promise<void> {
        try {
            const email = req.body.email;
            const { travelStyles } = req.body;

            const updated = await this.service.updateUserTravelStyles(
                email,
                travelStyles
            );
            this.handleSuccess(res, {
                email: email,
                updated
            }, 200, "Travel styles updated");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async uploadUserProfile(req : Request , res : Response) : Promise<void> {
       try {
            const {accessToken} = req.cookies;
            const userInfo : Partial<User> = verifyJwt(accessToken,config.ACCESSTOKEN_SECRET);
            this.service.uploadProfilePicture(userInfo.email ?? "",req.file)
            this.handleSuccess(res, null, 200 , "uploaded");
       }
       catch (error) {
            this.handleError(error,res);
       }
    }
}
