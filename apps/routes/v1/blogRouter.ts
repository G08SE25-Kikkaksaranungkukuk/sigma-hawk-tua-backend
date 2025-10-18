
import { BlogController } from "@/controllers/blog/blogController";
import { BaseRouter } from "../baseRouter";

/**
 * Blog Router v1
 * Handles blog search and filtering endpoints for API version 1
 */
export class BlogRouterV1 extends BaseRouter {
	private readonly blogController: BlogController;

	constructor() {
		super();
		this.blogController = new BlogController();
		this.setupRoutes();
	}

	private setupRoutes(): void {
		// Blog search/filter endpoint
		this.router.get(
			"/search",
			this.blogController.searchBlogs.bind(this.blogController)
		);
	}
}
