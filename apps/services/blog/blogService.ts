import { Blog } from "@/prisma/index";
import { BlogRepository } from "@/repository/Blog/blogRepository";
import { blogCreateReq } from "@/types/blog/blogRequest";
import { AppError } from "@/types/error/AppError";

export class BlogService {
    private repo: BlogRepository;

    constructor() {
        this.repo = new BlogRepository();
    }

    async uploadBlogMedia(pic : Express.Multer.File | undefined) : Promise<string> {
        try {
            const ret = await this.repo.uploadMedia(pic);
            return ret
        } 
        catch (error : any) {
            throw new AppError(
                `Failed to upload new blog media: ${error.message}`,
                500
            );
        }
    }
    
    async createBlog(user_id : number , data : blogCreateReq) {
        try {
            const ret = await this.repo.createBlog(user_id , data);
            return ret
        }
        catch(error : any) {
            throw new AppError(
                `Failed to create new blog : ${error.message}`,
                500
            );
        }
    }

    async getMyBlog(user_id : number | undefined) {
        try {
            const ret = await this.repo.getMyBlog(user_id);
            return ret
        }
        catch(error : any) {
            throw new AppError(
                `Failed to create new blog : ${error.message}`,
                500
            );
        }
    }

    async getLikes(user_id : number, blog_id : string) {
        try {
            const ret = await this.repo.getLikes(user_id, blog_id);
            return ret;
        }
        catch(error : any) {
            throw new AppError(
                `Failed to retrieve like count from blog: ${error.message}`,
                500
            )
        }
    }

    async isUserLike(user_id : number, blog_id : string) {
        try {
            const ret = await this.repo.isUserLike(user_id, blog_id);
            return ret;
        }
        catch(error : any) {
            throw new AppError(
                `Failed to get user like status : ${error.message}`,
                500
            )
        }
    }

    async userLike(user_id : number, blog_id : string) {
        try {
            const ret = await this.repo.userLike(user_id, blog_id);
            return ret;
        }
        catch(error : any) {
            throw new AppError(
                `Failed to like blog : ${error.message}`,
                500
            )
        }
    }

    async userUnlike(user_id : number, blog_id : string) {
        try {
            const ret = await this.repo.userUnlike(user_id , blog_id);
            return ret
        }
        catch(error : any) {
            throw new AppError(
                `Failed to unlike blog : ${error.message}`,
                500
            )
        }
    }

    async getBlogManifest(user_id : number , blog_id : string) : Promise<Blog> {
        try {
            const ret = await this.repo.getBlogManifest(user_id , blog_id);
            return ret
        }
        catch(error : any) {
            throw new AppError(
                `Failed to get blog's manifest : ${error.message}`,
                500
            )
        }
    }

    async updateBlog(user_id : number , blog_id : string , dat : blogCreateReq) {
        try {
            const ret = await this.repo.updateBlog(user_id , blog_id , dat);
            return ret
        }
        catch(error : any) {
            throw new AppError(
                `Failed to update blog's manifest : ${error.message}`,
                500
            )
        }
    }

    async deleteBlog(user_id : number , blog_id : string) {
        try {
            const ret = await this.repo.deleteBlog(user_id , blog_id);
            return ret
        }
        catch(error : any) {
            throw new AppError(
                `Failed to delete blog's manifest : ${error.message}`,
                500
            )
        }
    }

    async getPublicBlog(blog_id : string) {
        try {
            const ret = await this.repo.getBlogContent(blog_id);
            return ret
        } catch(error : any) {
            throw new AppError(
                `Failed to fetch blog's content : ${error.message}`,
                500
            )
        }
    }

}
