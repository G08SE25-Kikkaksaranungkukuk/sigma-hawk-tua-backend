import z from "zod";

// Valid interest keys enum - updated to match new seed data
const validInterestKeys = [
  "SEA", "MOUNTAIN", "WATERFALL", "NATIONAL_PARK", "ISLAND", 
  "TEMPLE", "SHOPPING_MALL", "MARKET", "CAFE", "HISTORICAL", 
  "AMUSEMENT_PARK", "ZOO", "FESTIVAL", "MUSEUM", "FOOD_STREET", 
  "BEACH_BAR", "THEATRE"
] as const;

const ImageFileSchema = z
  .any()
  .refine(
    f => !f || (typeof f === "object" && "mimetype" in f && String(f.mimetype).startsWith("image/")),
    "profile must be an image file"
  )
  .refine(
    f => !f || (typeof f === "object" && "size" in f && Number(f.size) <= 5 * 1024 * 1024),
    "profile must be ≤ 5 MB"
  );

export const groupCreateSchema = z.object({
    group_name: z.string().min(1, "Group name is required"),
    group_leader_id: z.coerce.number().int().min(1, "Valid group leader ID is required"),
    description: z.string().optional(),
    profile: ImageFileSchema.optional(),
    max_members: z.coerce.number().int().min(1).max(100).optional().default(10),
    interest_fields: z.array(z.enum(validInterestKeys)).optional()
})