import { User } from "../models/user";
import db from "../database/db";
import { Trip } from "../models/trip";
import { Child } from "../models/child";
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

    async postTripByUserEmail(id: number, child_id: number, authorization_id: number): Promise<Trip | undefined> {
        const userRepository = db.getRepository(User);  
        const user = await userRepository.findOne({ where: { id } });  
        const childRepository = db.getRepository(Child);
        const child = await childRepository.findOne({ where: { child_id } });
        const authorizationRepository = db.getRepository(Authorization);
        const authorization = await authorizationRepository.findOne({ where: { authorization_id } });
        const trip = new Trip();
        trip.user = user as User;
        trip.school = child?.school || "";
        trip.status = "pending";
        trip.vehicle = authorization as Authorization;
        trip.children = child as Child;
        const tripRepository = db.getRepository(Trip);  
        const result = await tripRepository.save(trip); 
        return result ? result : undefined;

    }

    

}

export default new TripService();




