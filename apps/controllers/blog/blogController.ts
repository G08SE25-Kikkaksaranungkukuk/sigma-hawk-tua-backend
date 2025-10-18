import { Request, Response } from "express";
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

    /**
     * Search and filter blogs by keyword, tag, interest_id, date
     * GET /blog/search?keyword=...&tag=...&interest_id=...&date=...
     */
    async searchBlogs(req: Request, res: Response): Promise<void> {
        try {
            const { keyword, interest_id, date, page, page_size } = req.query;
            // Parse interest_id from query: can be string, string[], or undefined
            let interestIds: number[] | undefined = undefined;
            if (interest_id) {
                if (Array.isArray(interest_id)) {
                    interestIds = interest_id.map((id) => Number(id)).filter((id) => !isNaN(id));
                } else if (typeof interest_id === 'string') {
                    // Support comma-separated values or single value
                    interestIds = interest_id.split(',').map((id) => Number(id)).filter((id) => !isNaN(id));
                }
            }
            const filter = {
                keyword: keyword as string | undefined,
                interest_id: interestIds,
                date: date as string | undefined,
                page: page ? Number(page) : 1,
                page_size: page_size ? Number(page_size) : 10,
            };
            const result = await this.blogService.searchBlogs(filter);
            this.handleSuccess(res, result, 200);
            } catch (error) {
            this.handleError(error, res);
        }
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

    async getLikes(req : Request , res : Response) : Promise<void> {
        try {
            const userInfo = req.user
            const {blog_id} = req.params;
            if(!userInfo) throw new AppError("Not Logged In",401)
            if(!blog_id) throw new AppError("No specified blog's manifest",404);
            const response_data  = {
                "is_like_by_me" : await this.blogService.isUserLike(userInfo.user_id, blog_id),
                "count" : await this.blogService.getLikes(userInfo.user_id,blog_id)
            }
            this.handleSuccess(res,response_data,200,"success")
        }
        catch(error : any) {
            this.handleError(error,res);
        }
    }

    async userLike(req : Request , res : Response) : Promise<void> {
        try {
            const userInfo = req.user
            const {blog_id} = req.params;
            if(!userInfo) throw new AppError("Not Logged In",401)
            if(!blog_id) throw new AppError("No specified blog's manifest",404);
            const dat = await this.blogService.userLike(userInfo.user_id, blog_id);
            this.handleSuccess(res,dat,200,"success")
        }
        catch(error : any) {
            this.handleError(error,res);
        }
    }

    async userUnlike(req : Request , res : Response) : Promise<void> {
        try {
            const userInfo = req.user
            const {blog_id} = req.params
            if(!userInfo) throw new AppError("Not Logged In",401)
            if(!blog_id) throw new AppError("No specified blog's manifest",404);
            const dat = await this.blogService.userUnlike(userInfo.user_id,blog_id)
            this.handleSuccess(res,null,200,"deleted")
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
}
