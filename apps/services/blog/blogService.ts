import { BlogRepository } from "@/repository/Blog/blogRepository";
import { AppError } from "@/types/error/AppError";
import { BlogSearchFilter } from "@/types/blog/blogRequest";
import { Blog } from "@/prisma/index";
import { blogCreateReq } from "@/types/blog/blogRequest";

export class BlogService {
    private blogRepository: BlogRepository;

    constructor() {
        this.blogRepository = new BlogRepository();
    }

    /**
     * Search and filter blogs by keyword, tag, author, date
     */
    async searchBlogs(filter: BlogSearchFilter) {
        try {
            // Default pagination
            const page = filter.page && filter.page > 0 ? filter.page : 1;
            const page_size = filter.page_size && filter.page_size > 0 ? Math.min(filter.page_size, 100) : 10;
            filter.page = page;
            filter.page_size = page_size;

            // Ensure interest_id is always an array or undefined
            let interestFilter: number[] | undefined = undefined;
            if (filter.interest_id) {
                if (Array.isArray(filter.interest_id)) {
                    interestFilter = filter.interest_id.length > 0 ? filter.interest_id : undefined;
                } else {
                    interestFilter = [filter.interest_id];
                }
            }
            const repoFilter = { ...filter, interest_id: interestFilter };
            const result = await this.blogRepository.searchBlogs(repoFilter);
            return result;
        } catch (error: unknown) {
            console.error(error);
            throw new AppError("Failed to search blogs", 500);
        }

        
    }

        async uploadBlogMedia(pic : Express.Multer.File | undefined) : Promise<string> {
        try {
            const ret = await this.blogRepository.uploadMedia(pic);
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
            const ret = await this.blogRepository.createBlog(user_id , data);
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
            const ret = await this.blogRepository.getMyBlog(user_id);
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
            const ret = await this.blogRepository.getLikes(user_id, blog_id);
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
            const ret = await this.blogRepository.isUserLike(user_id, blog_id);
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
            const ret = await this.blogRepository.userLike(user_id, blog_id);
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
            const ret = await this.blogRepository.userUnlike(user_id , blog_id);
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
            const ret = await this.blogRepository.getBlogManifest(user_id , blog_id);
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
            const ret = await this.blogRepository.updateBlog(user_id , blog_id , dat);
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
            const ret = await this.blogRepository.deleteBlog(user_id , blog_id);
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
            const ret = await this.blogRepository.getBlogContent(blog_id);
            return ret
        } catch(error : any) {
            throw new AppError(
                `Failed to fetch blog's content : ${error.message}`,
                500
            )
        }
    }
}