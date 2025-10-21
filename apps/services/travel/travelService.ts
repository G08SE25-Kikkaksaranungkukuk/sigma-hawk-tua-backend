import { TravelRepository } from "@/repository/travel/travelRespository";

export class TravelService {
    private repo: TravelRepository;

    constructor() {
        this.repo = new TravelRepository();
    }

    async getTravelHistory(user_id : number) {
        const travelHistory = await this.repo.getTravelHistory(user_id);
        return travelHistory;
    }

}
