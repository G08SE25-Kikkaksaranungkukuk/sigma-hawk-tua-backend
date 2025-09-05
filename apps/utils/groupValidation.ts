import z from "zod";

export const groupCreateSchema = z.object({
    group_name : z.string(),
    interest_fields : z.array(z.string()),
    group_leader_id : z.int().min(0)
})