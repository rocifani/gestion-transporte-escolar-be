import { Request, Response } from 'express';
import tripService from '../services/tripService';
import { sendError, sendSuccess } from '../utils/requestHandlers';

class TripController {

    async getAllTrips(_req: Request, res: Response){
        try{
            const trips = await tripService.getAllTrips();
            sendSuccess(res, trips);
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getTripById(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const trip = await tripService.getTripById(id);
            if(trip){
                sendSuccess(res, trip);
            }
            else{
                sendError(res, "Trip not found", 404);
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async postTrip(req: Request, res: Response){
        try{
            const data = req.body; // TO DO: validar datos del body en el back
            const trip = await tripService.postTrip(data);
            if(trip){
                sendSuccess(res, trip);
            }
            else{
                sendError(res, "Trip could not be created", 500); // TO DO: manejar errores específicos
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async putTrip(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const data = req.body; // TO DO: validar datos del body en el back
            const trip = await tripService.putTrip(id, data);
            if(trip){
                sendSuccess(res, trip);
            }
            else{
                sendError(res, "Trip not found", 404); // TO DO: manejar errores específicos
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getTripByUser(req: Request, res: Response) {
        try {
            const userId = Number(req.userId); 
            if (!userId) {
                return sendError(res, "Acceso denegado", 401); 
            }
            const trips = await tripService.getTripByUser(userId);
            return sendSuccess(res, trips); 
        } 
        catch (error: any) {
            return sendError(res, error.message); 
        }
    }


}

export default new TripController();