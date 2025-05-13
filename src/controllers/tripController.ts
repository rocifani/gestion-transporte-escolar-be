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

    async postTrip(req: Request, res: Response) {
        try {
          const data = req.body;
          const requiredFields = ["available_capacity", "authorization"];
          const missingFields = requiredFields.filter(field => !data[field] && data[field] !== 0);
          if (missingFields.length > 0) {
            return sendError(res, `Faltan los siguientes campos: ${missingFields.join(", ")}`, 400);
          }
          if (isNaN(Number(data.available_capacity)) || Number(data.available_capacity) < 0) {
            return sendError(res, "La capacidad disponible debe ser un número positivo", 400);
          }
          const allowedStatuses = ["pending", "completed", "cancelled"];
          if (data.status && !allowedStatuses.includes(data.status)) {
            return sendError(res, `El estado debe ser uno de: ${allowedStatuses.join(", ")}`, 400);
          }
          if (data.date && isNaN(Date.parse(data.date))) {
            return sendError(res, "La fecha no es válida (debe ser ISO 8601)", 400);
          }
          const trip = await tripService.postTrip(data);
      
          if (trip) {
            sendSuccess(res, trip);
          } else {
            sendError(res, "El viaje no pudo ser creado", 500);
          }
      
        } catch (error: any) {
          if (error.code === '23503') {
            sendError(res, "La autorización especificada no existe", 400); 
          } else {
            sendError(res, error.message || "Error interno del servidor", 500);
          }
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

    async getPaymentsByDriver(req: Request, res: Response) {
        try {
            const userId = Number(req.userId); 
            if (!userId) {
                return sendError(res, "Acceso denegado", 401); 
            } 
            const trips = await tripService.getPaymentsByDriver();
            return sendSuccess(res, trips); 
        } 
        catch (error: any) {
            return sendError(res, error.message); 
        }
    }

    async markTripsAsPaid(req: Request, res: Response): Promise<void> {
        const { userId, month } = req.body;

        try {
          await tripService.markTripsAsPaid(userId, month);
          res.status(200).json({ message: "Pagos marcados como realizados" });
        } catch (error: any) {
          return sendError(res, error.message); 
        }
      }

    async startTrip(req: Request, res: Response): Promise<void> {
      const tripId = parseInt(req.params.id);

      try {
        const result = await tripService.startTrip(tripId);
        return sendSuccess(res, result); 
      } catch (error: any) {
        return sendError(res, error.message); 
      }
    };

    async finishTrip(req: Request, res: Response): Promise<void> {
      const tripId = parseInt(req.params.id);

      try {
        const result = await tripService.finishTrip(tripId);
        return sendSuccess(res, result); 
      } catch (error: any) {
        return sendError(res, error.message); 
      }
    };


}

export default new TripController();