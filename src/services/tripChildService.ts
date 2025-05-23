import { IsNull } from "typeorm";
import db from "../database/db";
import { Child } from "../models/child";
import { Trip } from "../models/trip";
import { TripChild } from "../models/trip_child";

class TripChildService {

    async postTripChild(trip_id: number, child_id: number): Promise<any> {
        const tripChildRepository = db.getRepository(TripChild);  
        const tripChild = new TripChild();
        const trip = await db.getRepository(Trip).findOne({ where: { trip_id } });
        if (!trip) {
            throw new Error(`Trip with id ${trip_id} not found`);
        }
        tripChild.trip = trip;
        const child = await db.getRepository(Child).findOne({ where: { child_id } });
        if (!child) {
            throw new Error(`Child with id ${child_id} not found`);
        }
        tripChild.child = child;

        const result = await tripChildRepository.save(tripChild);  
        return result ?? undefined; 
    }

    async getTripChildById(trip_child_id: number): Promise<TripChild | undefined> {
        const tripChildRepository = db.getRepository(TripChild);  
        const tripChild = await tripChildRepository.findOne({ 
            where: { trip_child_id, deleted_at: IsNull() },
            relations: ["trip", "child", "trip.authorization"] 
        });
        return tripChild ?? undefined; 
    }

    async getTripChildByUserId(user_id: number): Promise<TripChild[]> {
        const tripChildRepository = db.getRepository(TripChild);
    
        const tripChildren = await tripChildRepository
            .createQueryBuilder("trip_child")
            .leftJoinAndSelect("trip_child.child", "child")
            .leftJoinAndSelect("trip_child.trip", "trip")
            .leftJoin("child.user", "user")
            .where("user.id = :user_id", { user_id })
            .andWhere("trip_child.deleted_at IS NULL")
            .getMany();
    
        return tripChildren;
    }

    async getTripChildByTripId(trip_id: number): Promise<TripChild[]> {
        const tripChildRepository = db.getRepository(TripChild);  

        const tripChildren = await tripChildRepository
            .createQueryBuilder("trip_child")
            .leftJoinAndSelect("trip_child.child", "child")
            .leftJoin("child.user", "user")
            .where("trip_child.trip = :trip_id", { trip_id })
            .andWhere("trip_child.deleted_at IS NULL")
            .getMany();  
        return tripChildren;  
    }

    async getTripChildByChildId(child_id: number): Promise<TripChild[]> {
        const tripChildRepository = db.getRepository(TripChild);  

        const tripChildren = await tripChildRepository
            .createQueryBuilder("trip_child")
            .leftJoinAndSelect("trip_child.trip", "trip")
            .leftJoinAndSelect("trip_child.child", "child")
            .where("child.child_id = :child_id", { child_id })
            .andWhere("trip_child.deleted_at IS NULL")
            .getMany();  
        return tripChildren;  
    }

    async getParentAddressesByTripId(trip_id: number): Promise<string[]> {
        const tripChildRepository = db.getRepository(TripChild);
      
        const tripChildren = await tripChildRepository
            .createQueryBuilder("trip_child")
            .leftJoin("trip_child.child", "child")
            .leftJoin("child.user", "user")
            .select("user.address", "address")
            .where("trip_child.trip = :tripId", { tripId: trip_id })
            .andWhere("trip_child.deleted_at IS NULL")
            .getRawMany();
      
        return tripChildren.map(item => item.address);
    }

    async deleteTripChild(trip_child_id: number): Promise<boolean> {
        const tripChildRepository = db.getRepository(TripChild);
        const tripChild = await tripChildRepository.findOne({ where: { trip_child_id, deleted_at: IsNull() } });

        if (tripChild) {
            tripChild.deleted_at = new Date().toString();
            await tripChildRepository.save(tripChild);
            return true;
        }
        return false;
    }
}

export default new TripChildService();
