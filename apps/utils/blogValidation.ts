import z from "zod";

export const blogCreateSchema = z.object({
    title : z.string(),
    interest_id: z.array(z.number()),
    description: z.string(),
    json_config : z.string(),
    html_output : z.string()
})

export const blogInterest = z.object({
blog_id : z.number(),
interest_id : z.number()
})