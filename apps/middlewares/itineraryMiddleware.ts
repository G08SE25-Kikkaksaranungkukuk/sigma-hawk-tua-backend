import { Request, Response, NextFunction } from "express";
import { AppError } from "@/types/error/AppError";
import { ItineraryRepository } from "@/repository/Itinerary/itineraryRepository";

/**
 * Group Member Middleware
 * Verifies that the authenticated user is a member of the specified group
 */
export const groupMemberMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userInfo = req.user;
        if (!userInfo) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }

        const groupId = parseInt(req.params.group_id);
        if (isNaN(groupId)) {
            res.status(400).json({
                success: false,
                message: "Invalid group ID"
            });
            return;
        }

        const repository = new ItineraryRepository();
        const isMember = await repository.isUserGroupMember(userInfo.user_id, groupId);

        if (!isMember) {
            res.status(403).json({
                success: false,
                message: "You must be a member of this group to access this resource"
            });
            return;
        }

        next();
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to verify group membership"
        });
    }
};

/**
 * Group Leader Middleware
 * Verifies that the authenticated user is the leader of the specified group
 */
export const groupLeaderMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userInfo = req.user;
        if (!userInfo) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }

        const groupId = parseInt(req.params.group_id);
        if (isNaN(groupId)) {
            res.status(400).json({
                success: false,
                message: "Invalid group ID"
            });
            return;
        }

        const repository = new ItineraryRepository();
        const isLeader = await repository.isUserGroupLeader(userInfo.user_id, groupId);

        if (!isLeader) {
            res.status(403).json({
                success: false,
                message: "Only group leaders can perform this action"
            });
            return;
        }

        next();
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to verify group leadership"
        });
    }
};

/**
 * Itinerary Permission Middleware
 * Verifies that the authenticated user has permission to modify the specified itinerary
 * (Must be leader of at least one group that has this itinerary)
 */
export const itineraryPermissionMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userInfo = req.user;
        if (!userInfo) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });
            return;
        }

        const itineraryId = parseInt(req.params.itinerary_id);
        if (isNaN(itineraryId)) {
            res.status(400).json({
                success: false,
                message: "Invalid itinerary ID"
            });
            return;
        }

        const repository = new ItineraryRepository();
        const itinerary: any = await repository.getItineraryById(itineraryId);

        if (!itinerary) {
            res.status(404).json({
                success: false,
                message: "Itinerary not found"
            });
            return;
        }

        // Check if user is leader of any group that has this itinerary
        let hasPermission = false;
        for (const groupItinerary of itinerary.groups || []) {
            const isLeader = await repository.isUserGroupLeader(userInfo.user_id, groupItinerary.group_id);
            if (isLeader) {
                hasPermission = true;
                break;
            }
        }

        if (!hasPermission) {
            res.status(403).json({
                success: false,
                message: "You don't have permission to modify this itinerary"
            });
            return;
        }

        next();
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to verify itinerary permissions"
        });
    }
};