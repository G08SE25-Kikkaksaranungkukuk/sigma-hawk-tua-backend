import { Router } from "express";
import { BaseRouter } from "../baseRouter";
import { ReportController } from "@/controllers/report/reportController";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { 
    validateCreateReport, 
    validateUpdateReport, 
    validatePagination, 
    validateReportId, 
    validateBlogId,
    adminMiddleware
} from "@/middlewares/reportMiddleware";

/**
 * Report Router v2
 * Handles report management endpoints for API version 2
 * Includes creating reports, viewing reports, and admin functionality
 */
export class ReportRouterV2 extends BaseRouter {
    private readonly reportController: ReportController;

    constructor() {
        super();
        this.reportController = new ReportController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // CREATE - Create a new report (authenticated users)
        this.router.post(
            "/",
            authMiddleware,
            validateCreateReport,
            this.reportController.createReport.bind(this.reportController)
        );

        // READ - Get current user's reports
        this.router.get(
            "/me",
            authMiddleware,
            validatePagination,
            this.reportController.getMyReports.bind(this.reportController)
        );

        // READ - Get report statistics
        this.router.get(
            "/stats",
            authMiddleware,
            this.reportController.getReportStats.bind(this.reportController)
        );

        // READ - Get reports for a specific blog (Admin functionality)
        this.router.get(
            "/blog/:blogId",
            authMiddleware,
            adminMiddleware,
            validateBlogId,
            validatePagination,
            this.reportController.getReportsByBlog.bind(this.reportController)
        );

        // READ - Get all reports with filters (Admin functionality)
        this.router.get(
            "/",
            authMiddleware,
            adminMiddleware,
            validatePagination,
            this.reportController.getAllReports.bind(this.reportController)
        );

        // READ - Get specific report by ID
        this.router.get(
            "/:id",
            authMiddleware,
            validateReportId,
            this.reportController.getReportById.bind(this.reportController)
        );

        // UPDATE - Update report
        this.router.put(
            "/:id",
            authMiddleware,
            validateReportId,
            validateUpdateReport,
            this.reportController.updateReport.bind(this.reportController)
        );

        // DELETE - Delete report (Admin functionality)
        this.router.delete(
            "/:id",
            authMiddleware,
            adminMiddleware,
            validateReportId,
            this.reportController.deleteReport.bind(this.reportController)
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}