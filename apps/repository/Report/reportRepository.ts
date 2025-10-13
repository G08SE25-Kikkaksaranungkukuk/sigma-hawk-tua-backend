import { prisma } from "@/config/prismaClient";
import { ReportFilters } from "@/types/report/reportTypes";

/**
 * Report Repository
 * Handles all database operations related to reports
 * Using the existing schema: id, report_id, user_id, title, reason, description, created_at
 */
export class ReportRepository {
    /**
     * Create a new report
     */
    async createReport(data: {
        report_id: number; // This represents the blog_id being reported
        user_id: number;
        title: string;
        reason: string;
        description: string;
    }) {
        try {
            return await prisma.report.create({
                data: {
                    report_id: data.report_id,
                    user_id: data.user_id,
                    title: data.title,
                    reason: data.reason,
                    description: data.description
                }
            });
        } catch (error) {
            console.error("Error creating report:", error);
            throw new Error("Failed to create report");
        }
    }

    /**
     * Get all reports with optional filters
     */
    async getReports(filters: ReportFilters = {}) {
        try {
            const {
                blog_id, // This will map to report_id
                user_id,
                page = 1,
                limit = 10
            } = filters;

            const skip = (page - 1) * limit;

            const whereClause: any = {};
            
            if (blog_id) whereClause.report_id = blog_id; // report_id represents blog_id
            if (user_id) whereClause.user_id = user_id;

            const reports = await prisma.report.findMany({
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
                where: { id: reportId }
            });
        } catch (error) {
            console.error("Error fetching report by ID:", error);
            throw new Error("Failed to fetch report");
        }
    }

    /**
     * Update report (can update title, reason, description)
     */
    async updateReport(reportId: number, data: {
        title?: string;
        reason?: string;
        description?: string;
    }) {
        try {
            return await prisma.report.update({
                where: { id: reportId },
                data
            });
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
                where: { id: reportId }
            });
        } catch (error) {
            console.error("Error deleting report:", error);
            throw new Error("Failed to delete report");
        }
    }

    /**
     * Check if user has already reported a blog
     */
    async hasUserReportedBlog(userId: number, blogId: number) {
        try {
            const existingReport = await prisma.report.findFirst({
                where: {
                    user_id: userId,
                    report_id: blogId // report_id represents blog_id
                }
            });
            return !!existingReport;
        } catch (error) {
            console.error("Error checking existing report:", error);
            throw new Error("Failed to check existing report");
        }
    }

    /**
     * Get reports by user (reports made by specific user)
     */
    async getReportsByUser(userId: number, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const reports = await prisma.report.findMany({
                where: { user_id: userId },
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            });

            const total = await prisma.report.count({
                where: { user_id: userId }
            });

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
            console.error("Error fetching user reports:", error);
            throw new Error("Failed to fetch user reports");
        }
    }

    /**
     * Get reports for a specific blog
     */
    async getReportsByBlog(blogId: number, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const reports = await prisma.report.findMany({
                where: { report_id: blogId }, // report_id represents blog_id
                skip,
                take: limit,
                orderBy: { created_at: 'desc' }
            });

            const total = await prisma.report.count({
                where: { report_id: blogId }
            });

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
            console.error("Error fetching blog reports:", error);
            throw new Error("Failed to fetch blog reports");
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