/**
 * Report Types
 * Type definitions for Report operations
 * Schema: id, report_id, user_id, title, reason, description, created_at
 */

export interface CreateReportRequest {
    report_id: number; // This represents blog_id being reported
    title: string;
    reason: string;
    description: string;
}

export interface CreateReportResponse {
    success: boolean;
    message: string;
    report?: {
        id: number;
        report_id: number; // blog_id
        user_id: number;
        title: string;
        reason: string;
        description: string;
        created_at: Date;
    };
}

export interface GetReportsResponse {
    success: boolean;
    reports: {
        id: number;
        report_id: number; // blog_id
        user_id: number;
        title: string;
        reason: string;
        description: string;
        created_at: Date;
    }[];
    pagination?: {
        current_page: number;
        total_pages: number;
        total_records: number;
        per_page: number;
    };
}

export interface UpdateReportRequest {
    title?: string;
    reason?: string;
    description?: string;
}

export interface ReportFilters {
    blog_id?: number; // This will map to report_id in queries
    user_id?: number;
    page?: number;
    limit?: number;
}

export interface ReportStatsResponse {
    success: boolean;
    stats: {
        total_reports: number;
        reports_by_user: number;
        reports_for_blog: number;
    };
}