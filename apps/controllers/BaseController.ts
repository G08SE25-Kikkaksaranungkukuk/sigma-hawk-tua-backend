import { Response } from "express";
import { ErrorHandler } from "@/utils/errorHandler";

export abstract class BaseController {
    /**
     * Send successful response with consistent format
     * @param res - Express response object
     * @param data - Data to send in response
     * @param statusCode - HTTP status code (default: 200)
     * @param message - Optional success message
     */
    protected handleSuccess(
        res: Response, 
        data: any, 
        statusCode: number = 200, 
        message?: string
    ): void {
        const response: any = {
            success: true,
            data
        };

        if (message) {
            response.message = message;
        }

        res.status(statusCode).json(response);
    }

    /**
     * Handle errors using centralized error handler
     * @param error - Error object to handle
     * @param res - Express response object
     */
    protected handleError(error: unknown, res: Response): void {
        ErrorHandler.handle(error, res);
    }

    /**
     * Set secure HTTP cookies for authentication tokens
     * @param res - Express response object
     * @param tokens - Object containing accessToken and refreshToken
     */
    protected setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }): void {
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie("accessToken", tokens.accessToken, {
            maxAge: 60 * 60 * 24 * 1000, // 24 hours in milliseconds
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax'
        });

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days in milliseconds
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'strict' : 'lax'
        });
    }

    /**
     * Clear authentication cookies
     * @param res - Express response object
     */
    protected clearAuthCookies(res: Response): void {
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
        });
        
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
        });
    }
}
