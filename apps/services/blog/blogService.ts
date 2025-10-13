import { BlogRepository } from "@/repository/Blog/blogRepository";
import { AppError } from "@/types/error/AppError";

export interface BlogSearchFilter {
    keyword?: string;
    tag?: string;
    author?: string;
    date?: string;
    page?: number;
    page_size?: number;
}

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
            const result = await this.blogRepository.searchBlogs(filter);
            return result;
        } catch (error: unknown) {
            console.error(error);
            throw new AppError("Failed to search blogs", 500);
        }
    }
}
