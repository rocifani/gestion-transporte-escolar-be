import db from "../database/db";
import { Trip } from "../models/trip";
import { Authorization } from "../models/authorization";

class TripService {

    async getAllTrips(): Promise<Trip[]> {
        const tripRepository = db.getRepository(Trip);  
        return await tripRepository.find();  
    } 

    async getTripByUser(id: number): Promise<Trip[]> {
        const tripRepository = db.getRepository(Trip); 
        console.log("ID: ", id);
        return await tripRepository.createQueryBuilder("trips")
            .leftJoinAndSelect("trips.authorization", "authorization")
            .leftJoin("authorization.user", "user")
            .where("user.id = :user_id", { user_id: id })
            .getMany();  
    }

    async getTripById(trip_id: number): Promise<Trip | undefined> {
        const tripRepository = db.getRepository(Trip);
        const trip = await tripRepository.findOne({ where: { trip_id } });  
        return trip ?? undefined;
    }

    async postTrip(data: Trip): Promise<Trip | undefined> {
        const tripRepository = db.getRepository(Trip);  
        const result = await tripRepository.save(data);  

        return result ? result : undefined; 
    }

    async postTripByUserEmail(authorization_id: number): Promise<Trip | undefined> {
        const authorizationRepository = db.getRepository(Authorization);
        const authorization = await authorizationRepository.findOne({ where: { authorization_id } });
        const trip = new Trip();
        trip.status = "pending";
        trip.authorization = authorization as Authorization;
        const tripRepository = db.getRepository(Trip);  
        const result = await tripRepository.save(trip); 

        return result ? result : undefined;
    }

    async putTripByAuthorizationAndShift(authorization: number, child_shift: string, selected_date: string): Promise<Trip | undefined> {
        const tripRepository = db.getRepository(Trip);  
        const trip = await tripRepository.findOne({
            where: {
              authorization: {
                authorization_id: authorization,
                work_shift: child_shift,
              },
              date: selected_date,
            },
            relations: ['authorization'], 
          }); 
        if (trip) {
            trip.available_capacity -= 1; 
            await tripRepository.save(trip); 
        }
        return trip ? trip : undefined; 
    }

    async getSchoolByTripId(trip_id: number): Promise<string> {
        const tripRepository = db.getRepository(Trip);
          
        const trip = await tripRepository
            .createQueryBuilder("trip")
            .leftJoin("trip.authorization", "authorization")
            .select("authorization.school_address", "school")
            .where("trip.trip_id = :tripId", { tripId: trip_id })
            .getRawOne();
          
        return trip ? trip.school : '';
    }

    async getDriverAddressByTripId(trip_id: number): Promise<string> {
        const tripRepository = db.getRepository(Trip);
          
        const driver = await tripRepository
            .createQueryBuilder("trip")
            .leftJoin("trip.authorization", "authorization")
            .select("authorization.address", "address")
            .where("trip.trip_id = :tripId", { tripId: trip_id })
            .getRawOne();
          
        return driver ? driver.address : '';
    }
}

export default new TripService();




