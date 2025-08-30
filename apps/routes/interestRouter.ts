import { Router } from "express";
import {
    createInterests,
    getInterests,
    updateInterests,
    deleteInterests,
} from "@/services/interest/interestService";

import { authMiddleware } from "@/middlewares/interestMiddleware";

export const interestRouter: Router = Router();

interestRouter.use(authMiddleware);

interestRouter.post("/users/interests:id/", createInterests);
interestRouter.get("/users/interests:id/", getInterests);
interestRouter.put("/users/interests:id/", updateInterests);
interestRouter.delete("/users/interests:id/", deleteInterests);
