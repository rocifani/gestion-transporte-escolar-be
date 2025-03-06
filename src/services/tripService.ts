import db from "../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Trip } from "../models/trip";

class TripService {

    async getAllTrips(): Promise<Trip[]> {
        const trips = await db.query<RowDataPacket[]>("SELECT * FROM trip");
        return trips as Trip[];
    }

    async getTripById(trip_id: number): Promise<Trip | undefined> {
        const trip = await db.query<RowDataPacket[]>("SELECT * FROM trip WHERE trip_id = ?", trip_id);
        if(Array.isArray(trip) && trip.length > 0){
            return trip[0] as Trip;
        }
        return undefined;
    }

    async postTrip(data: Trip): Promise<Trip | undefined> {
        const result = await db.query<ResultSetHeader>("INSERT INTO trip SET ?", data);
        if(result.insertId){
            return await this.getTripById(result.insertId);
        }
        return undefined;
    }

    async putTrip(trip_id: number, data: Trip): Promise<Trip | undefined> {
        const result = await db.query<ResultSetHeader>("UPDATE trip SET ? WHERE trip_id = ?", [data, trip_id]);
        if(result.affectedRows){
            return await this.getTripById(trip_id);
        }
        return undefined;
    }

    // TO DO: implementar delete. No se si hacer un borrado definitivo o un borrado lógico.

}

export default new TripService();



