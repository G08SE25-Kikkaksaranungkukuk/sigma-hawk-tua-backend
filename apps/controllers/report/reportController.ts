import { Request, Response } from "express";
import { BaseController } from "@/controllers/BaseController";
import { ReportService } from "@/services/report/reportService";
import { CreateReportRequest, UpdateReportRequest, ReportFilters } from "@/types/report/reportTypes";

/**
 * Report Controller
 * Handles HTTP requests for report operations
 */
export class ReportController extends BaseController {
    private reportService: ReportService;

    constructor() {
        super();
        this.reportService = new ReportService();
    }

    /**
     * Create a new report
     * POST /api/v2/reports
     */
    async createReport(req: Request, res: Response) {
        try {
            const userId = req.user?.user_id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const reportData: CreateReportRequest = {
                report_id: parseInt(req.body.report_id), // blog_id
                title: req.body.title,
                reason: req.body.reason,
                description: req.body.description || ""
            };

            // Validate required fields
            if (!reportData.report_id || !reportData.title || !reportData.reason) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Missing required fields: report_id, title, reason" 
                });
            }

            const result = await this.reportService.createReport(userId, reportData);

            if (result.success) {
                return this.handleSuccess(res, result.report, 201, result.message);
            } else {
                return res.status(400).json({ success: false, message: result.message });
            }
        } catch (error) {
            console.error("Error in createReport controller:", error);
            return this.handleError(error, res);
        }
    }

    /**
     * Get all reports with filters (Admin only)
     * GET /api/v2/reports
     */
    async getAllReports(req: Request, res: Response) {
        try {
            const filters: ReportFilters = {
                blog_id: req.query.blog_id ? parseInt(req.query.blog_id as string) : undefined,
                user_id: req.query.user_id ? parseInt(req.query.user_id as string) : undefined,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10
            };

            const result = await this.reportService.getReports(filters);

            if (result.success) {
                return this.handleSuccess(res, {
                    reports: result.reports,
                    pagination: result.pagination
                }, 200, "Reports fetched successfully");
            } else {
                return res.status(500).json({ success: false, message: "Failed to fetch reports" });
            }
        } catch (error) {
            console.error("Error in getAllReports controller:", error);
            return this.handleError(error, res);
        }
    }

    /**
     * Get report by ID
     * GET /api/v2/reports/:id
     */
    async getReportById(req: Request, res: Response) {
        try {
            const reportId = parseInt(req.params.id);
            
            if (!reportId || isNaN(reportId)) {
                return res.status(400).json({ success: false, message: "Invalid report ID" });
            }

            const result = await this.reportService.getReportById(reportId);

            if (result.success) {
                return this.handleSuccess(res, result.report, 200, "Report fetched successfully");
            } else {
                return res.status(404).json({ success: false, message: result.message || "Report not found" });
            }
        } catch (error) {
            console.error("Error in getReportById controller:", error);
            return this.handleError(error, res);
        }
    }

    /**
     * Update report
     * PUT /api/v2/reports/:id
     */
    async updateReport(req: Request, res: Response) {
        try {
            const reportId = parseInt(req.params.id);
            
            if (!reportId || isNaN(reportId)) {
                return res.status(400).json({ success: false, message: "Invalid report ID" });
            }

            const updateData: UpdateReportRequest = {
                title: req.body.title,
                reason: req.body.reason,
                description: req.body.description
            };

            // Remove undefined fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key as keyof UpdateReportRequest] === undefined) {
                    delete updateData[key as keyof UpdateReportRequest];
                }
            });

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ success: false, message: "No fields to update" });
            }

            const result = await this.reportService.updateReport(reportId, updateData);

            if (result.success) {
                return this.handleSuccess(res, result.report, 200, result.message);
            } else {
                return res.status(400).json({ success: false, message: result.message || "Failed to update report" });
            }
        } catch (error) {
            console.error("Error in updateReport controller:", error);
            return this.handleError(error, res);
        }
    }

    /**
     * Delete report
     * DELETE /api/v2/reports/:id
     */
    async deleteReport(req: Request, res: Response) {
        try {
            const reportId = parseInt(req.params.id);
            
            if (!reportId || isNaN(reportId)) {
                return res.status(400).json({ success: false, message: "Invalid report ID" });
            }

            const result = await this.reportService.deleteReport(reportId);

            if (result.success) {
                return this.handleSuccess(res, null, 200, result.message);
            } else {
                return res.status(404).json({ success: false, message: result.message || "Failed to delete report" });
            }
        } catch (error) {
            console.error("Error in deleteReport controller:", error);
            return this.handleError(error, res);
        }
    }

    /**
     * Get current user's reports
     * GET /api/v2/reports/me
     */
    async getMyReports(req: Request, res: Response) {
        try {
            const userId = req.user?.user_id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

            const result = await this.reportService.getMyReports(userId, page, limit);

            if (result.success) {
                return this.handleSuccess(res, {
                    reports: result.reports,
                    pagination: result.pagination
                }, 200, "Your reports fetched successfully");
            } else {
                return res.status(500).json({ success: false, message: result.message || "Failed to fetch your reports" });
            }
        } catch (error) {
            console.error("Error in getMyReports controller:", error);
            return this.handleError(error, res);
        }
    }

    /**
     * Get reports for a specific blog (Admin only)
     * GET /api/v2/reports/blog/:blogId
     */
    async getReportsByBlog(req: Request, res: Response) {
        try {
            const blogId = parseInt(req.params.blogId);
            
            if (!blogId || isNaN(blogId)) {
                return res.status(400).json({ success: false, message: "Invalid blog ID" });
            }

            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

            const result = await this.reportService.getReportsByBlog(blogId, page, limit);

            if (result.success) {
                return this.handleSuccess(res, {
                    reports: result.reports,
                    pagination: result.pagination
                }, 200, "Blog reports fetched successfully");
            } else {
                return res.status(500).json({ success: false, message: result.message || "Failed to fetch blog reports" });
            }
        } catch (error) {
            console.error("Error in getReportsByBlog controller:", error);
            return this.handleError(error, res);
        }
    }

    /**
     * Get report statistics
     * GET /api/v2/reports/stats
     */
    async getReportStats(req: Request, res: Response) {
        try {
            const userId = req.query.user_id ? parseInt(req.query.user_id as string) : undefined;
            const blogId = req.query.blog_id ? parseInt(req.query.blog_id as string) : undefined;

            const result = await this.reportService.getReportStats(userId, blogId);

            return this.handleSuccess(res, result.stats, 200, "Report statistics fetched successfully");
        } catch (error) {
            console.error("Error in getReportStats controller:", error);
            return this.handleError(error, res);
        }
    }
}