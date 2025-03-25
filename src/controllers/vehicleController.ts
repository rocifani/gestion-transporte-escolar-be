import { Request, Response } from 'express';
import vehicleService from '../services/vehicleService';
import { sendError, sendSuccess } from '../utils/requestHandlers';

class VehicleController {

    async getAllVehicles(_req: Request, res: Response){
        try{
            const vehicles = await vehicleService.getAllVehicles();
            sendSuccess(res, vehicles);
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getVehicleById(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const vehicle = await vehicleService.getVehicleById(id);
            if(vehicle){
                sendSuccess(res, vehicle);
            }
            else{
                sendError(res, "Vehiculo no encontrado", 404);
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async postVehicle(req: Request, res: Response){
        try{
            const data = req.body; // TO DO: validar datos del body en el back
            data.user = Number(req.userId); 
            const vehicle = await vehicleService.postVehicle(data);
            if(vehicle){
                sendSuccess(res, vehicle);
            }
            else{
                sendError(res, "El vehiculo no pudo ser creado", 500); // TO DO: manejar errores específicos
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async putVehicle(req: Request, res: Response){
        try{
            const userId = Number(req.userId); 
            const data = req.body; // TO DO: validar datos del body en el back
            const vehicle = await vehicleService.putVehicle(userId, data);
            if(vehicle){
                sendSuccess(res, vehicle);
            }
            else{
                sendError(res, "Vehiculo no encontrado", 404); // TO DO: manejar errores específicos
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getVehicleByUser(req: Request, res: Response) {
        try {
            const userId = Number(req.userId); 
            if (!userId) {
                return sendError(res, "Acceso denegado", 401); 
            }
            const vehicle = await vehicleService.getVehicleByUser(userId);
            return sendSuccess(res, vehicle); 
        } 
        catch (error: any) {
            return sendError(res, error.message); 
        }
    }
}

export default new VehicleController();