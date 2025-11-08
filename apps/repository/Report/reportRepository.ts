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
    async createReport(user_id: number, payload: CreateReportRequest): Promise<any> {
        const { reason, ...reportData } = payload as any;

        const report = await prisma.report.create({
            data: {
                user_id,
                ...reportData
            }
        });

        // If a reason string is provided, map it to a ReportTag and connect
        if (reason && typeof reason === 'string' && reason.trim().length > 0) {
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

            await prisma.report.update({
                where: { report_id: report.report_id },
                data: {
                    report_tag: {
                        connect: { id: tag.id }
                    }
                }
            });
        }

        return report;
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

        // filter by report_id (controller may pass id)
        if (id) whereClause.report_id = id;
        if (title) whereClause.title = { contains: title, mode: 'insensitive' };

        // filter by reason: look into related ReportReason -> ReportTag (key or label)
        if (reason) {
            whereClause.reason = {
                some: {
                    report_tag: {
                        OR: [
                            { key: { contains: reason, mode: 'insensitive' } },
                            { label: { contains: reason, mode: 'insensitive' } }
                        ]
                    }
                }
            };
        }

            const reports = await prisma.report.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    report_tag: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            const total = await prisma.report.count({ where: whereClause });
            return {
                reports: reports,
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
     * Get all available report tags/reasons
     */
    async getAllReportReason() {
        try {
            const tags = await prisma.reportTag.findMany({
                select: { id: true, key: true, label: true, emoji: true, description: true },
                orderBy: { label: 'asc' }
            });
            return tags;
        } catch (error) {
            console.error('Error fetching report reasons:', error);
            throw new Error('Failed to fetch report reasons');
        }
    }

    /**
     * Get report by ID
     */
    async getReportById(reportId: number) {
        try {
            const report = await prisma.report.findUnique({
                where: { report_id: reportId },
                include: {
                    report_tag: true
                }
            });
            return report;
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
            const { reason, ...updateData } = payload as any;

            const updatedReport = await prisma.report.update({
                where: { report_id: reportId, user_id: user_id },
                data: updateData
            });


            // Update report tag relation using the `report_tag` relation (connect to found/created tag)
            if (reason !== undefined) {
                if (reason && typeof reason === 'string' && reason.trim().length > 0) {
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

                    await prisma.report.update({
                        where: { report_id: reportId },
                        data: {
                            report_tag: {
                                connect: { id: tag.id }
                            }
                        }
                    });
                } else {
                    // If an explicit empty reason was provided, attempt to connect to a generic OTHER tag if it exists
                    const other = await prisma.reportTag.findUnique({ where: { key: 'OTHER' } });
                    if (other) {
                        await prisma.report.update({
                            where: { report_id: reportId },
                            data: { report_tag: { connect: { id: other.id } } }
                        });
                    }
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

    /**
     * Get all reports
     */
    async getAllReports(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const reports = await prisma.report.findMany({
                skip,
                take: limit,
                include: { report_tag: true },
                orderBy: { created_at: 'desc' }
            });

            const total = await prisma.report.count();
            return {
                reports: reports,
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