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
            const { keyword, tag, author, date, page, page_size } = req.query;
            const filter = {
                keyword: keyword as string | undefined,
                tag: tag as string | undefined,
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
