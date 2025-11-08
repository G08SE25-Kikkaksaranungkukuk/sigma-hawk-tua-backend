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
            title: req.body.title,
            report_tag: req.body.report_tag || "",
            description: req.body.description || "",
            user_id: req.body.user_id
        };

        // Validate required fields
        if (!reportData.title || !reportData.report_tag || reportData.report_tag.trim().length === 0 ||
            !reportData.user_id
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: title or report_tag or description or user_id"
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
                id: req.query.id ? parseInt(req.query.id as string) : undefined,
                title: req.query.title ? req.query.title as string : undefined,
                reason: req.query.reason ? req.query.reason as string : undefined,
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
     * Get all report reasons/tags (public)
     * GET /api/v2/reports/reasons
     */
    async getAllReportReasons(req: Request, res: Response) {
        try {
            const result = await this.reportService.getAllReportReasons();
            if (result.success) {
                return this.handleSuccess(res, { reasons: result.reasons }, 200, "Report reasons fetched successfully");
            }
            return res.status(500).json({ success: false, reasons: [] });
        } catch (error) {
            console.error("Error in getAllReportReasons controller:", error);
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
            const userId = req.user?.user_id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

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

            const result = await this.reportService.updateReport(reportId, userId, updateData);

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

    // Removed getMyReports since we don't have user_id in simple schema

    // Removed getReportsByBlog since we don't have blog relations in simple schema

    /**
     * Get report statistics
     * GET /api/v2/reports/stats
     */
    async getReportStats(req: Request, res: Response) {
        try {
            const result = await this.reportService.getReportStats();

            return this.handleSuccess(res, result.stats, 200, "Report statistics fetched successfully");
        } catch (error) {
            console.error("Error in getReportStats controller:", error);
            return this.handleError(error, res);
        }
    }
}