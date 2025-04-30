import { Request, Response } from 'express';
import priceService from '../services/priceService';
import { sendError, sendSuccess } from '../utils/requestHandlers';

class PriceController {

    async getAllPrices(_req: Request, res: Response){
        try{
            const prices = await priceService.getAllPrices();
            sendSuccess(res, prices);
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getPriceById(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const price = await priceService.getPriceById(id);
            if(price){
                sendSuccess(res, price);
            }
            else{
                sendError(res, "Price not found", 404);
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async postPrice(req: Request, res: Response) {
        try {
          const data = req.body;
          const requiredFields = ["monthly_price", "daily_price", "date_from"];
          const missingFields = requiredFields.filter(field => !data[field] && data[field] !== 0);
          if (missingFields.length > 0) {
            return sendError(res, `Faltan los siguientes campos: ${missingFields.join(", ")}`, 400);
          }
          if (isNaN(Number(data.monthly_price)) || Number(data.monthly_price) < 0) {
            return sendError(res, "El precio mensual debe ser un número válido", 400);
          }
          if (isNaN(Number(data.daily_price)) || Number(data.daily_price) < 0) {
            return sendError(res, "El precio diario debe ser un número válido", 400);
          }
          data.user = Number(req.userId);
          const price = await priceService.postPrice(data);
          if (price) {
            sendSuccess(res, price);
          } else {
            sendError(res, "El precio no pudo ser creado", 500);
          }
        } catch (error: any) {
            sendError(res, error.message || "Error interno del servidor", 500);
        }
      }

   
    async getPriceByUser(req: Request, res: Response) {
        try {
            const userId = Number(req.userId); 
            if (!userId) {
                return sendError(res, "Acceso denegado", 401); 
            }
            const prices = await priceService.getPriceByUser(userId);
            return sendSuccess(res, prices); 
        } 
        catch (error: any) {
            return sendError(res, error.message); 
        }
    }

    async getPriceByUserAuthorization(req: Request, res: Response) {
        try {
            const userId = Number(req.userId); 
            if (!userId) {
                return sendError(res, "Acceso denegado", 401); 
            }
            const id = Number(req.params['id']);
            const price = await priceService.getPriceByUserAuthorization(id);
            return sendSuccess(res, price); 
        }
        catch (error: any) {
            return sendError(res, error.message); 
        }
    }

    async deletePrice(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const deleted = await priceService.deletePrice(id);
            if(deleted){
                sendSuccess(res, "Alumno eliminado correctamente");
            }
            else{
                sendError(res, "Alumno no encontrado", 404); 
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }


}

export default new PriceController();