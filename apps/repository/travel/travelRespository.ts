import { prisma } from "@/config/prismaClient";

export class TravelRepository {
    async getTravelHistory(user_id : number) {
        const user_groups_itineraries = await prisma.group.findMany({
            where : {
                'Belongs' : {
                    'some' : {
                        User : {
                            user_id : user_id
                        }
                    }
                }
            },
            include : {
                itineraries : {
                    include : {
                        itinerary : {
                            'select' : {
                                'title' : true,
                                'description' : true,
                                'start_date' : true,
                                'end_date' : true,
                                'place_links' : true,
                            }
                        }
                    }
                }
            }
        });
        return user_groups_itineraries; 
    }
}