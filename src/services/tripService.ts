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
        return await tripRepository.createQueryBuilder("trips")
            .where("trips.userId = :user_id", { user_id: id })
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

    async putTrip(trip_id: number, data: Partial<Trip>): Promise<Trip | undefined> {
        const tripRepository = db.getRepository(Trip);  
        const trip = await tripRepository.findOne({ where: { trip_id } });  

        if (!trip) {
            return undefined;  
        }

        Object.assign(trip, data);  
        await tripRepository.save(trip);  

        return trip;  
    }
}

export default new TripService();




