
import { BlogRepository } from "@/repository/Blog/blogRepository";
import { AppError } from "@/types/error/AppError";
import { BlogSearchFilter } from "@/types/blog/blogRequest";

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
}
