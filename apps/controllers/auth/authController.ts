import { Request, Response } from "express";
import * as interestService from "@/services/interest/interestService.ts";
import { updateInterestsSchema } from "../schemas/interests";

export async function createInterests(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const parsed = updateInterestsSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.format() });

    const interests = await interestService.setUserInterests(
        userId,
        parsed.data.interests
    );
    return res.status(201).json({ interests });
}

export async function getInterests(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const interests = await interestService.getUserInterests(userId);
    if (!interests) return res.status(404).json({ error: "User not found" });
    return res.json({ interests });
}

export async function updateInterests(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const parsed = updateInterestsSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.format() });

    const interests = await interestService.setUserInterests(
        userId,
        parsed.data.interests
    );
    return res.json({ interests });
}

export async function deleteInterests(req: Request, res: Response) {
    const userId = Number(req.params.id);
    await interestService.clearUserInterests(userId);
    return res.status(204).send();
}
