import { Router } from "express";
import { BaseRouter } from "../baseRouter";
import multer from "multer";
import { BlogController } from "@/controllers/blog/blogController";
import { blogMiddleware } from "@/middlewares/blogMiddleware";
    
const upload = multer({ 
    dest: "uploads/", 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * User Router v1
 * Handles user management endpoints for API version 1
 * Includes profile management, interests, and travel styles
 */
export class BlogRouterV2 extends BaseRouter {
    private readonly blogController: BlogController;

    constructor() {
        super();
        this.blogController = new BlogController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Profile management
        this.router.post(
            "/media",
            upload.single("media"),
            this.blogController.uploadBlogMedia.bind(this.blogController)
        );

        this.router.post(
            "/",
            blogMiddleware,
            this.blogController.createBlog.bind(this.blogController)
        );

        this.router.get(
            "/:blog_id/manifest",
            blogMiddleware,
            this.blogController.getBlogManifest.bind(this.blogController)
        );

        this.router.put(
            "/:blog_id/",
            blogMiddleware,
            this.blogController.updateBlog.bind(this.blogController)
        );

        this.router.delete(
            "/:blog_id/",
            blogMiddleware,
            this.blogController.deleteBlog.bind(this.blogController)
        );

        this.router.get(
            "/:blog_id/content",
            this.blogController.getPublicBlog.bind(this.blogController)
        );

        this.router.get(
            "/list/me",
            blogMiddleware,
            this.blogController.getMyBlog.bind(this.blogController)
        );

        this.router.get(
            "/search",
            //blogMiddleware,
            this.blogController.searchBlogs.bind(this.blogController)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}