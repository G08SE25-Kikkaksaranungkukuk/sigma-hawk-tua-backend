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
            // Get email from authenticated user (set by userMiddleware)
            if (!req.user?.email) {
                throw new Error("User not authenticated");
            }
            
            console.log(`[UserController] Fetching user profile for: ${req.user.email}`);
            const user = await this.service.getUser(req.user.email);
            console.log(`[UserController] Successfully fetched user profile for: ${req.user.email}, has profile_url: ${!!user.profile_url}`);
            this.handleSuccess(res, user, 200);
        } catch (error) {
            console.error(`[UserController] Error fetching user profile:`, error);
            this.handleError(error, res);
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            // Get email from authenticated user (set by userMiddleware)
            if (!req.user?.email) {
                throw new Error("User not authenticated");
            }
            
            const userData = req.body;
            const updatedUser = await this.service.updateUser(req.user.email, userData);
            this.handleSuccess(res, { user: updatedUser }, 200, "User profile updated successfully");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async getAllTravelStyles(req: Request, res: Response): Promise<void> {
        try {
            const travelStyles = await this.service.getAllTravelStyles();
            this.handleSuccess(res, { travelStyles }, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async getAllInterests(req: Request, res: Response): Promise<void> {
        try {
            const interests = await this.service.getAllInterests();
            this.handleSuccess(res, { interests }, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                throw new Error("User not authenticated");
            }
            const { password } = req.body;
            const email = req.user.email; // from JWT/session middleware
            await this.service.DeleteUser(email, password);
            this.clearAuthCookies(res);
            this.handleSuccess(res, null, 200, "Account deleted");
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
            this.handleSuccess(
                res,
                {
                    email: email,
                    updated,
                },
                200,
                "Travel styles updated"
            );
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async uploadUserProfile(req: Request, res: Response): Promise<void> {
        try {
            // Get user info from middleware (set by userMiddleware)
            if (!req.user?.email) {
                throw new Error("User not authenticated");
            }
            
            await this.service.uploadProfilePicture(req.user.email, req.file);
            this.handleSuccess(res, { message: "Profile picture uploaded successfully" }, 200);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async getUserProfilePicture(req: Request, res: Response): Promise<void> {
        try {
            //no need cookies, just need email
            const email = req.params.email;
            const pic = await this.service.getUserProfilePicture(email);
            if (!pic) {
                this.handleError(new Error("Profile picture not found"), res);
                return;
            }
            res.set("Content-Type", "image/jpeg");
            res.send(pic);
        } catch (error) {
            this.handleError(error, res);
        }
    }
}
