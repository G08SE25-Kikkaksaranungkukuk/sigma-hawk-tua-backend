import { Request, Response, NextFunction } from "express";

/**
 * Report Middleware
 * Handles validation and authorization for report operations
 */

/**
 * Validates report creation data
 */
export const validateCreateReport = (req: Request, res: Response, next: NextFunction) => {
    const { title, reason } = req.body;

    // Check required fields (id will be auto-generated)
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "title is required and must be a non-empty string"
        });
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "reason is required and must be a non-empty string"
        });
    }

    // Validate field lengths
    if (title.length > 200) {
        return res.status(400).json({
            success: false,
            message: "title must be less than 200 characters"
        });
    }

    if (reason.length > 100) {
        return res.status(400).json({
            success: false,
            message: "reason must be less than 100 characters"
        });
    }

    if (req.body.description && req.body.description.length > 500) {
        return res.status(400).json({
            success: false,
            message: "description must be less than 500 characters"
        });
    }

    // No need to validate report_id since it's auto-generated
    next();
};

/**
 * Validates report update data
 */
export const validateUpdateReport = (req: Request, res: Response, next: NextFunction) => {
    const { title, reason, description, is_resolved } = req.body;

    // At least one field must be provided
    if (!title && !reason && description === undefined && is_resolved === undefined) {
        return res.status(400).json({
            success: false,
            message: "At least one field (title, reason, description, is_resolved) must be provided for update"
        });
    }

    // Validate field lengths if provided
    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "title must be a non-empty string"
            });
        }
        
        if (title.length > 200) {
            return res.status(400).json({
                success: false,
                message: "title must be less than 200 characters"
            });
        }
    }

    if (reason !== undefined) {
        if (typeof reason !== 'string' || reason.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "reason must be a non-empty string"
            });
        }
        
        if (reason.length > 100) {
            return res.status(400).json({
                success: false,
                message: "reason must be less than 100 characters"
            });
        }
    }

    if (description !== undefined) {
        if (typeof description !== 'string') {
            return res.status(400).json({
                success: false,
                message: "description must be a string"
            });
        }
        
        if (description.length > 500) {
            return res.status(400).json({
                success: false,
                message: "description must be less than 500 characters"
            });
        }
    }

    if (is_resolved !== undefined) {
        if (typeof is_resolved !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: "is_resolved must be a boolean"
            });
        }
    }

    next();
};

/**
 * Validates pagination parameters
 */
export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;

    if (page) {
        const pageNum = parseInt(page as string);
        if (isNaN(pageNum) || pageNum < 1) {
            return res.status(400).json({
                success: false,
                message: "page must be a positive integer"
            });
        }
        req.query.page = pageNum.toString();
    }

    if (limit) {
        const limitNum = parseInt(limit as string);
        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
            return res.status(400).json({
                success: false,
                message: "limit must be a positive integer between 1 and 100"
            });
        }
        req.query.limit = limitNum.toString();
    }

    next();
};

/**
 * Validates report ID parameter
 */
export const validateReportId = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Report ID is required"
        });
    }

    const reportId = parseInt(id);
    if (isNaN(reportId) || reportId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Report ID must be a valid positive integer"
        });
    }

    // Store parsed ID for use in controller
    req.params.id = reportId.toString();
    
    next();
};

/**
 * Validates blog ID parameter
 */
export const validateBlogId = (req: Request, res: Response, next: NextFunction) => {
    const { blogId } = req.params;

    if (!blogId) {
        return res.status(400).json({
            success: false,
            message: "Blog ID is required"
        });
    }

    const blogIdNum = parseInt(blogId);
    if (isNaN(blogIdNum) || blogIdNum <= 0) {
        return res.status(400).json({
            success: false,
            message: "Blog ID must be a valid positive integer"
        });
    }

    // Store parsed ID for use in controller
    req.params.blogId = blogIdNum.toString();
    
    next();
};

/**
 * Admin middleware placeholder
 * TODO: Implement proper admin role checking
 */
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // For now, just pass through
    // TODO: Add proper admin role checking when user roles are implemented
    console.warn("Admin middleware called but not implemented - allowing all authenticated users");
    next();
};

/**
 * Report ownership middleware - checks if user owns the report
 */
export const checkReportOwnership = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.user_id;
        const reportId = parseInt(req.params.id);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // TODO: Add database check to verify report ownership
        // For now, we'll handle this in the service layer
        next();
    } catch (error) {
        console.error("Error in checkReportOwnership middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};