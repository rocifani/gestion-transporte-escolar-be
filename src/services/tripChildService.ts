import db from "../database/db";

class TripChildService {
    async postTripChild(trip_id: number, child_id: number): Promise<any> {
        const tripChildRepository = db.getRepository("trip_child");  
        const tripChild = tripChildRepository.create({ trip_id, child_id });
        const result = await tripChildRepository.save(tripChild);  
        return result ? result : undefined; 
    }
}

export default new TripChildService();