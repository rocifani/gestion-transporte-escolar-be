import db from "../database/db";
import { Trip } from "../models/trip";

class TripService {

    async getAllTrips(): Promise<Trip[]> {
        const tripRepository = db.getRepository(Trip);  
        return await tripRepository.find();  
    } 

    async getTripByUser(id: number): Promise<Trip | null> {
        const tripRepository = db.getRepository(Trip); 
        return await tripRepository.createQueryBuilder("trips").
        where("trips.userId = :user_id", { user_id: id }).getOne();
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

    async putTrip(trip_id: number, data: Trip): Promise<Trip | undefined> {
        const tripRepository = db.getRepository(Trip); 
        const trip = await tripRepository.findOne({ where: { trip_id } });

        if (trip) {
            
            trip.user= data.user || trip.user;
            trip.school = data.school || trip.school;
            trip.date = data.date || trip.date;
            trip.status = data.status || trip.status;
          
            await tripRepository.save(trip);
            return trip;
        }

        return undefined;  
    }

    

}

export default new TripService();




