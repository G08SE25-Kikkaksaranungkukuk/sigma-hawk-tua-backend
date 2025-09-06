import { Response } from "express";
import { AppError } from "@/types/error/AppError";

export class ErrorHandler {
    /**
     * Centralized error handling for all controllers
     * @param error - The error object to handle
     * @param res - Express response object
     */
    static handle(error: unknown, res: Response): void {
        // Handle custom application errors
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message,
                code: error.statusCode
            });
            return;
        }

        // Handle Prisma validation errors
        if (error && typeof error === 'object' && 'code' in error) {
            const prismaError = error as any;
            
            // Unique constraint violation
            if (prismaError.code === 'P2002') {
                res.status(409).json({
                    success: false,
                    message: "Resource already exists",
                    code: 409
                });
                return;
            }

            // Record not found
            if (prismaError.code === 'P2025') {
                res.status(404).json({
                    success: false,
                    message: "Record not found",
                    code: 404
                });
                return;
            }
        }

        // Handle validation errors
        if (error && typeof error === 'object' && 'issues' in error) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                code: 400,
                errors: (error as any).issues
            });
            return;
        }

        // Log unexpected errors for debugging
        console.error("Unexpected error:", error);
        
        // Generic server error
        res.status(500).json({
            success: false,
            message: "Internal server error",
            code: 500
        });
    }
}
