import db from "../database/db";
import { Child } from "../models/child";
import { Trip } from "../models/trip";
import { TripChild } from "../models/trip_child";

class TripChildService {

    async postTripChild(trip_id: number, child_id: number): Promise<any> {
        const tripChildRepository = db.getRepository(TripChild);  
        const tripChild= new TripChild();
        const trip = await db.getRepository(Trip).findOne({ where: { trip_id} });
        if (!trip) {
            throw new Error(`Trip with id ${trip_id} not found`);
        }
        tripChild.trip_id = trip;
        const child = await db.getRepository(Child).findOne({ where: { child_id } });
        if (!child) {
            throw new Error(`Child with id ${child_id} not found`);
        }
        tripChild.child_id = child;

        const result = await tripChildRepository.save(tripChild);  
        return result ? result : undefined; 
    }

    async getTripChildByUserId(user_id: number): Promise<TripChild[]> {

        const tripChildRepository = db.getRepository(TripChild);
    
        const tripChildren = await tripChildRepository
            .createQueryBuilder("trip_child")
            .leftJoinAndSelect("trip_child.child_id", "child")
            .leftJoinAndSelect("trip_child.trip_id", "trip") 
            .leftJoin("child.user", "user")
            .where("user.id = :user_id", { user_id })
            .getMany();
    
        return tripChildren;
    }
}

export default new TripChildService();