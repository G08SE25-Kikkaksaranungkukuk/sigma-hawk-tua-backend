import { ReportRepository } from "@/repository/Report/reportRepository";
import { 
    CreateReportRequest, 
    CreateReportResponse, 
    GetReportsResponse,
    UpdateReportRequest,
    ReportFilters,
    ReportStatsResponse
} from "@/types/report/reportTypes";

/**
 * Report Service
 * Handles business logic for report operations
 */
export class ReportService {
    private reportRepository: ReportRepository;

    constructor() {
        this.reportRepository = new ReportRepository();
    }

    /**
     * Create a new report
     */
    async createReport(userId: number, reportData: CreateReportRequest): Promise<CreateReportResponse> {
        try {
            // Check if user has already reported this blog
            const hasReported = await this.reportRepository.hasUserReportedBlog(userId, reportData.report_id);
            
            if (hasReported) {
                return {
                    success: false,
                    message: "You have already reported this blog"
                };
            }

            // Validate report data
            if (!reportData.title.trim() || !reportData.reason.trim()) {
                return {
                    success: false,
                    message: "Title and reason are required"
                };
            }

            if (reportData.title.length > 200) {
                return {
                    success: false,
                    message: "Title must be less than 200 characters"
                };
            }

            if (reportData.reason.length > 100) {
                return {
                    success: false,
                    message: "Reason must be less than 100 characters"
                };
            }

            if (reportData.description && reportData.description.length > 500) {
                return {
                    success: false,
                    message: "Description must be less than 500 characters"
                };
            }

            const report = await this.reportRepository.createReport({
                report_id: reportData.report_id,
                user_id: userId,
                title: reportData.title.trim(),
                reason: reportData.reason.trim(),
                description: reportData.description?.trim() || ""
            });

            return {
                success: true,
                message: "Report created successfully",
                report
            };
        } catch (error) {
            console.error("Error in createReport service:", error);
            return {
                success: false,
                message: "Failed to create report"
            };
        }
    }

    /**
     * Get all reports with filters (Admin only)
     */
    async getReports(filters: ReportFilters): Promise<GetReportsResponse> {
        try {
            const result = await this.reportRepository.getReports(filters);
            
            return {
                success: true,
                reports: result.reports,
                pagination: result.pagination
            };
        } catch (error) {
            console.error("Error in getReports service:", error);
            return {
                success: false,
                reports: []
            };
        }
    }

    /**
     * Get report by ID
     */
    async getReportById(reportId: number) {
        try {
            const report = await this.reportRepository.getReportById(reportId);
            
            if (!report) {
                return {
                    success: false,
                    message: "Report not found"
                };
            }

            return {
                success: true,
                report
            };
        } catch (error) {
            console.error("Error in getReportById service:", error);
            return {
                success: false,
                message: "Failed to fetch report"
            };
        }
    }

    /**
     * Update report
     */
    async updateReport(reportId: number, updateData: UpdateReportRequest) {
        try {
            // Check if report exists
            const existingReport = await this.reportRepository.getReportById(reportId);
            if (!existingReport) {
                return {
                    success: false,
                    message: "Report not found"
                };
            }

            // Validate update data
            if (updateData.title && updateData.title.length > 200) {
                return {
                    success: false,
                    message: "Title must be less than 200 characters"
                };
            }

            if (updateData.reason && updateData.reason.length > 100) {
                return {
                    success: false,
                    message: "Reason must be less than 100 characters"
                };
            }

            if (updateData.description && updateData.description.length > 500) {
                return {
                    success: false,
                    message: "Description must be less than 500 characters"
                };
            }

            const updatedReport = await this.reportRepository.updateReport(reportId, updateData);

            return {
                success: true,
                message: "Report updated successfully",
                report: updatedReport
            };
        } catch (error) {
            console.error("Error in updateReport service:", error);
            return {
                success: false,
                message: "Failed to update report"
            };
        }
    }

    /**
     * Delete report
     */
    async deleteReport(reportId: number) {
        try {
            // Check if report exists
            const existingReport = await this.reportRepository.getReportById(reportId);
            if (!existingReport) {
                return {
                    success: false,
                    message: "Report not found"
                };
            }

            await this.reportRepository.deleteReport(reportId);

            return {
                success: true,
                message: "Report deleted successfully"
            };
        } catch (error) {
            console.error("Error in deleteReport service:", error);
            return {
                success: false,
                message: "Failed to delete report"
            };
        }
    }

    /**
     * Get reports by user (user's own reports)
     */
    async getMyReports(userId: number, page: number = 1, limit: number = 10) {
        try {
            const result = await this.reportRepository.getReportsByUser(userId, page, limit);
            
            return {
                success: true,
                reports: result.reports,
                pagination: result.pagination
            };
        } catch (error) {
            console.error("Error in getMyReports service:", error);
            return {
                success: false,
                reports: [],
                message: "Failed to fetch your reports"
            };
        }
    }

    /**
     * Get reports for a specific blog (Admin only)
     */
    async getReportsByBlog(blogId: number, page: number = 1, limit: number = 10) {
        try {
            const result = await this.reportRepository.getReportsByBlog(blogId, page, limit);
            
            return {
                success: true,
                reports: result.reports,
                pagination: result.pagination
            };
        } catch (error) {
            console.error("Error in getReportsByBlog service:", error);
            return {
                success: false,
                reports: [],
                message: "Failed to fetch blog reports"
            };
        }
    }

    /**
     * Get report statistics
     */
    async getReportStats(userId?: number, blogId?: number): Promise<ReportStatsResponse> {
        try {
            const totalReports = await this.reportRepository.getReportsCount();
            
            let reportsByUser = 0;
            if (userId) {
                const userReportsResult = await this.reportRepository.getReportsByUser(userId, 1, 1);
                reportsByUser = userReportsResult.pagination.total_records;
            }

            let reportsForBlog = 0;
            if (blogId) {
                const blogReportsResult = await this.reportRepository.getReportsByBlog(blogId, 1, 1);
                reportsForBlog = blogReportsResult.pagination.total_records;
            }

            return {
                success: true,
                stats: {
                    total_reports: totalReports,
                    reports_by_user: reportsByUser,
                    reports_for_blog: reportsForBlog
                }
            };
        } catch (error) {
            console.error("Error in getReportStats service:", error);
            return {
                success: false,
                stats: {
                    total_reports: 0,
                    reports_by_user: 0,
                    reports_for_blog: 0
                }
            };
        }
    }
}