import db from "../database/db";
import { Vehicle } from "../models/vehicle";

class VehicleService {

    async getAllVehicles(): Promise<Vehicle[]> {
        const vehicleRepository = db.getRepository(Vehicle);  
        return await vehicleRepository.find();  
    }

    async getVehicleById(vehicle_id: number): Promise<Vehicle | undefined> {
        const vehicleRepository = db.getRepository(Vehicle);
        const vehicle = await vehicleRepository.findOne({ where: { vehicle_id } });  
        return vehicle ?? undefined;
    }

    async postVehicle(data: Vehicle): Promise<Vehicle | undefined> {
        const vehicleRepository = db.getRepository(Vehicle);          
        const result = await vehicleRepository.save(data);  

        return result ? result : undefined; 
    }

    async putVehicle(id: number, data: Vehicle): Promise<Vehicle | undefined> {
        const vehicleRepository = db.getRepository(Vehicle); 
        const vehicle = await vehicleRepository.createQueryBuilder("vehicles").where("vehicles.userId = :user_id", { user_id: id }).getOne();

        if (vehicle) {
            vehicle.make = data.make || vehicle.make;
            vehicle.model = data.model || vehicle.model;
            vehicle.year = data.year || vehicle.year;
            vehicle.licensePlate = data.licensePlate || vehicle.licensePlate;
            vehicle.capacity = data.capacity || vehicle.capacity;
            vehicle.authorization_pdf = data.authorization_pdf || vehicle.authorization_pdf;
          
            await vehicleRepository.save(vehicle);
            return vehicle;
        }

        return undefined;  
    }    

    async getVehicleByUser(id: number): Promise<Vehicle | null> {
        const vehicleRepository = db.getRepository(Vehicle); 
        return await vehicleRepository.createQueryBuilder("vehicles").
        where("vehicles.userId = :user_id", { user_id: id }).getOne();
    }

    

}

export default new VehicleService();




