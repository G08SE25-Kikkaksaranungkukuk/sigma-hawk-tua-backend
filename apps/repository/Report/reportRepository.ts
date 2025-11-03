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
        // payload contains { title, reason, description }
        const { reason, ...reportData } = payload as any;

        const newReportIssue = await prisma.report.create({
            data: {
                user_id: user_id,
                ...reportData,
            },
        });

        // If a reason (string) was provided, try to map it to a ReportTag and create a ReportReason
        if (reason && typeof reason === 'string' && reason.trim().length > 0) {
            // Try to find existing tag by key or label
            let tag = await prisma.reportTag.findFirst({
                where: {
                    OR: [
                        { key: reason },
                        { label: reason }
                    ]
                }
            });

            // If no tag exists, create a minimal one (use a slug for key)
            if (!tag) {
                const slug = reason.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
                tag = await prisma.reportTag.create({
                    data: {
                        key: slug,
                        label: reason,
                        emoji: '',
                        description: ''
                    }
                });
            }

            // Create the reportReason relation record
            await prisma.reportReason.create({
                data: {
                    report_id: newReportIssue.report_id,
                    report_tag_id: tag.id
                }
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
            // If reason provided, handle tag relation
            const { reason, ...updateData } = payload as any;

            const updatedReport = await prisma.report.update({
                where: { report_id: reportId, user_id: user_id },
                data: updateData
            });

            if (reason !== undefined) {
                // Remove existing reportReason if any
                await prisma.reportReason.deleteMany({ where: { report_id: reportId } });

                if (reason && typeof reason === 'string' && reason.trim().length > 0) {
                    // find or create tag
                    let tag = await prisma.reportTag.findFirst({
                        where: {
                            OR: [
                                { key: reason },
                                { label: reason }
                            ]
                        }
                    });

                    if (!tag) {
                        const slug = reason.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
                        tag = await prisma.reportTag.create({
                            data: {
                                key: slug,
                                label: reason,
                                emoji: '',
                                description: ''
                            }
                        });
                    }

                    await prisma.reportReason.create({
                        data: {
                            report_id: reportId,
                            report_tag_id: tag.id
                        }
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