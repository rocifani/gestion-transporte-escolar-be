import db from "../database/db";
import { Trip } from "../models/trip";

class TripService {

    async getAllTrips(): Promise<Trip[]> {
        const tripRepository = db.getRepository(Trip);  // Obtener el repositorio de la entidad Trip
        return await tripRepository.find();  // Usamos find() para obtener todos los viajes
    }

    async getTripById(trip_id: number): Promise<Trip | undefined> {
        const tripRepository = db.getRepository(Trip);  // Obtener el repositorio de la entidad Trip
        const trip = await tripRepository.findOne({ where: { trip_id } });  // Buscar por ID
        return trip ?? undefined;
    }

    async postTrip(data: Trip): Promise<Trip | undefined> {
        const tripRepository = db.getRepository(Trip);  // Obtener el repositorio de la entidad Trip
        const result = await tripRepository.save(data);  // Usamos save() para guardar el viaje

        return result ? result : undefined;  // Si la creación fue exitosa, retornamos el nuevo viaje
    }

    async putTrip(trip_id: number, data: Trip): Promise<Trip | undefined> {
        const tripRepository = db.getRepository(Trip);  // Obtener el repositorio de la entidad Trip
        const trip = await tripRepository.findOne({ where: { trip_id } });

        if (trip) {
            // Actualizamos los campos del viaje
            trip.user= data.user || trip.user;
            trip.school = data.school || trip.school;
            trip.date = data.date || trip.date;
            trip.status = data.status || trip.status;
            trip.updated_at = new Date(); 
            // Guardamos los cambios
            await tripRepository.save(trip);
            return trip;
        }

        return undefined;  // Si no se encuentra el viaje, retornamos undefined
    }

    // TO DO: implementar delete. No se si hacer un borrado definitivo o un borrado lógico.

}

export default new TripService();



