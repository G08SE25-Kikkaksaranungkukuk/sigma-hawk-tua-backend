import z from "zod";

export const blogCreateSchema = z.object({
    title : z.string(),
    description: z.string(),
    json_config : z.string(),
    html_output : z.string()
})