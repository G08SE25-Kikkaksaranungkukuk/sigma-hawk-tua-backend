import { Request, Response, NextFunction } from "express";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // Mock role check (ปรับตามจริงได้ เช่น JWT decode)
    if (token !== "Bearer mysecrettoken") {
        return res.status(403).json({ error: "Forbidden" });
    }

    next();
}
