import { prisma } from "@/config/prismaClient";

export class TravelRepository {
    async getTravelHistory(user_id : number) {
        const user_groups_itineraries = await prisma.group.findMany({
            include : {
                itineraries : true
            }
        });
        return user_groups_itineraries; 
    }
}