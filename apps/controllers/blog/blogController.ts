import { Request, Response } from "express";
import { BlogService } from "@/services/blog/blogService";
import { BaseController } from "@/controllers/BaseController";

export class BlogController extends BaseController {
    private blogService: BlogService;

    constructor() {
        super();
        this.blogService = new BlogService();
    }

    /**
     * Search and filter blogs by keyword, tag, author, date
     * GET /blog/search?keyword=...&tag=...&author=...&date=...
     */
    async searchBlogs(req: Request, res: Response): Promise<void> {
        try {
            const { keyword, interest_id, author, date, page, page_size } = req.query;
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
                author: author as string | undefined,
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
}
