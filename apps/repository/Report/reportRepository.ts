import { prisma } from "@/config/prismaClient";
import { Report } from "@/prisma/index";
import { CreateReportRequest, UpdateReportRequest, ReportFilters } from "@/types/report/reportTypes";

/**
 * Report Repository
 * Handles all database operations related to reports
 * Using the existing schema: id, report_id, user_id, title, reason, description, created_at
 */
export class ReportRepository {
    /**
     * Create a new report
     */
    async createReport(user_id: number, payload: CreateReportRequest): Promise<Report> {
        const { report_tag_id, ...reportData } = payload;

        const newReportIssue = await prisma.report.create({
            data: {
                user_id: user_id,
                ...reportData,
            },
        });

        if (report_tag_id && Array.isArray(report_tag_id) && report_tag_id.length > 0) {

            await prisma.reportReason.createMany({
                data: report_tag_id.map((id: number) => ({
                    report_id: newReportIssue.report_id,
                    report_tag_id: id,
                })),
            });
        }
        
        return newReportIssue;
    }

    /**
     * Get all reports with optional filters
     */
    async getReports(filters: ReportFilters = {}) {
        try {
        const {
            id,
            title,
            reason,
            page = 1,
            limit = 10
        } = filters;

        const skip = (page - 1) * limit;

        const whereClause: any = {};
        
        if (id) whereClause.id = id;
        if (title) whereClause.title = { contains: title, mode: 'insensitive' };
        if (reason) whereClause.reason = { contains: reason, mode: 'insensitive' };            const reports = await prisma.report.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: {
                    created_at: 'desc'
                }
            });

            const total = await prisma.report.count({ where: whereClause });

            return {
                reports,
                pagination: {
                    current_page: page,
                    total_pages: Math.ceil(total / limit),
                    total_records: total,
                    per_page: limit
                }
            };
        } catch (error) {
            console.error("Error fetching reports:", error);
            throw new Error("Failed to fetch reports");
        }
    }

    /**
     * Get report by ID
     */
    async getReportById(reportId: number) {
        try {
            return await prisma.report.findUnique({
                where: { report_id: reportId }
            });
        } catch (error) {
            console.error("Error fetching report by ID:", error);
            throw new Error("Failed to fetch report");
        }
    }

    /**
     * Update report (can update title, reason, description)
     */
    async updateReport(reportId: number, user_id: number, payload: UpdateReportRequest) {
        try {
            const { report_tag_id, ...updateData } = payload;
            
            const updatedReport = await prisma.report.update({
                where: { report_id: reportId, user_id: user_id },
                data: updateData
            });

            // Update report tags if provided
            if (report_tag_id !== undefined) {
                // Delete existing report tags
                await prisma.reportReason.deleteMany({
                    where: { report_id: reportId }
                });

                // Create new report tags if array is not empty
                if (Array.isArray(report_tag_id) && report_tag_id.length > 0) {
                    await prisma.reportReason.createMany({
                        data: report_tag_id.map((id: number) => ({
                            report_id: reportId,
                            report_tag_id: id,
                        })),
                    });
                }
            }

            return updatedReport;
        } catch (error) {
            console.error("Error updating report:", error);
            throw new Error("Failed to update report");
        }
    }

    /**
     * Delete report
     */
    async deleteReport(reportId: number) {
        try {
            return await prisma.report.delete({
                where: { report_id: reportId }
            });
        } catch (error) {
            console.error("Error deleting report:", error);
            throw new Error("Failed to delete report");
        }
    }

    // Removed hasUserReportedBlog since we don't have user_id or blog_id in simple schema

    // Removed getReportsByUser since we don't have user_id in simple schema

    // Removed getReportsByBlog since we don't have blog_id in simple schema

    /**
     * Get all reports
     */
    async getAllReports(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const reports = await prisma.report.findMany({
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            });

            const total = await prisma.report.count();

            return {
                reports,
                pagination: {
                    current_page: page,
                    total_pages: Math.ceil(total / limit),
                    total_records: total,
                    per_page: limit
                }
            };
        } catch (error) {
            console.error("Error fetching all reports:", error);
            throw new Error("Failed to fetch all reports");
        }
    }

    /**
     * Get all reports count for statistics
     */
    async getReportsCount() {
        try {
            return await prisma.report.count();
        } catch (error) {
            console.error("Error getting reports count:", error);
            throw new Error("Failed to get reports count");
        }
    }
}