import z from "zod";

// Valid interest keys enum - updated to match new seed data
const validInterestKeys = [
  "SEA", "MOUNTAIN", "WATERFALL", "NATIONAL_PARK", "ISLAND", 
  "TEMPLE", "SHOPPING_MALL", "MARKET", "CAFE", "HISTORICAL", 
  "AMUSEMENT_PARK", "ZOO", "FESTIVAL", "MUSEUM", "FOOD_STREET", 
  "BEACH_BAR", "THEATRE"
] as const;

export const groupCreateSchema = z.object({
    group_name: z.string().min(1, "Group name is required"),
    group_leader_id: z.number().int().min(1, "Valid group leader ID is required"),
    description: z.string().optional(),
    max_members: z.number().int().min(1).max(100).optional().default(10),
    interest_fields: z.array(z.enum(validInterestKeys)).optional()
})