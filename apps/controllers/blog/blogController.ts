import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "@/utils/jwt";
import { authRegisterReq } from "@/types/auth/authRequest";
import { BaseController } from "@/controllers/BaseController";
import { AppError } from "@/types/error/AppError";
import { BlogService } from "@/services/blog/blogService";
import { config } from "@/config/config";
import { blogCreateSchema } from "@/utils/blogValidation";

export class BlogController extends BaseController {
    private blogService : BlogService;

    constructor() {
        super();
        this.blogService = new BlogService();
    }

    async uploadBlogMedia(req: Request, res: Response): Promise<void> {
        try {
            const ret = await this.blogService.uploadBlogMedia(req.file);
            this.handleSuccess(res, {
                "path" : ret
            }, 200, "uploaded");
        } catch (error) {
            this.handleError(error, res);
        }
    }

    async createBlog(req : Request , res : Response) : Promise<void> {
        try {
            const userInfo = req.user
            if(!userInfo) throw new AppError("Not Logged In",401)
            const dat = blogCreateSchema.parse(req.body);
            const ret = await this.blogService.createBlog(userInfo.user_id,dat);
            this.handleSuccess(res,{
                blog_id : ret
            },200,"created")
        } catch (error) {
            this.handleError(error,res);
        }
    }

    async getMyBlog(req : Request , res : Response) : Promise<void> {
        try {
            const dat = await this.blogService.getMyBlog(req.user?.user_id);
            this.handleSuccess(res,dat,200,"success")
        } catch(error) {
            this.handleError(error,res);
        }
    }

    async getBlogManifest(req : Request , res : Response) : Promise<void> {
        try {
            const {blog_id} = req.params
            if(!req.user?.user_id) throw new AppError("You don't have rights to access this resource",403);
            if(!blog_id) throw new AppError("No specified blog's manifest",404);
            const dat = await this.blogService.getBlogManifest(req.user?.user_id,blog_id);
            this.handleSuccess(res,dat,200,"success")
        } catch(error) {
            this.handleError(error,res);
        }
    }

    async updateBlog(req : Request , res : Response) : Promise<void> {
        try {
            const userInfo = req.user
            const {blog_id} = req.params
            if(!userInfo) throw new AppError("Not Logged In",401)
            if(!blog_id) throw new AppError("No specified blog's manifest",404);
            const dat = blogCreateSchema.parse(req.body);
            const ret = await this.blogService.updateBlog(userInfo.user_id,blog_id,dat);
            this.handleSuccess(res,{
                blog_id : ret
            },200,"updated")
        } catch (error) {
            this.handleError(error,res);
        }
    }

    async deleteBlog(req : Request , res : Response) : Promise<void> {
        try {
            const userInfo = req.user
            const {blog_id} = req.params
            if(!userInfo) throw new AppError("Not Logged In",401)
            if(!blog_id) throw new AppError("No specified blog's manifest",404);
            const dat = await this.blogService.deleteBlog(userInfo.user_id,blog_id)
            this.handleSuccess(res,null,200,"deleted")
        } catch(error) {
            this.handleError(error,res);
        }
    }

    async getPublicBlog(req : Request , res : Response) : Promise<void> {
        try {
            const {blog_id} = req.params
            const dat = await this.blogService.getPublicBlog(blog_id);
            this.handleSuccess(res,dat,200,"success")
        } catch (error) {
            this.handleError(error,res);
        }
    }

    async searchBlogs(req: Request, res: Response): Promise<void> {
        try {
            const q = String(req.query.q ?? "").trim();
    
            const page = Math.max(1, Number(req.query.page ?? 1));
            const limit = Math.max(1, Number(req.query.limit ?? 10));
            const userIdParam = req.query.user_id !== undefined ? Number(req.query.user_id) : undefined;

            const rawSort = String(req.query.sort ?? "newest").toLowerCase();
            const allowedSorts = ["newest", "oldest", "most likes"];
            const sort = allowedSorts.includes(rawSort) ? (rawSort as "newest" | "oldest" | "most likes") : "newest";

            let requester: any | undefined;
            const authHeader = req.headers.authorization;
            const token = req.cookies?.accessToken ?? (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined);
            if (token) {
                try {
                    requester = verifyJwt(token, config.ACCESSTOKEN_SECRET);
                } catch {
                    // ignore invalid token for public search
                }
            }

            // If filtering by specific user, require either that user or admin
            if (typeof userIdParam === "number" && !Number.isNaN(userIdParam)) {
                if (!requester || (requester.user_id !== userIdParam && requester.role !== "ADMIN")) {
                    throw new AppError("Forbidden: cannot filter by other user's blogs", 403);
                }
            }

            const results = await this.blogService.searchBlogs(q, page, limit, userIdParam, sort);
            this.handleSuccess(res, results, 200, "success");
        } catch (error) {
            this.handleError(error, res);
        }
    }

}
