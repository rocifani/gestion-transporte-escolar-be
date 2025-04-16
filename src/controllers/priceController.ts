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

    async postPrice(req: Request, res: Response){
    try{
        const data = req.body; 
        console.log(data);
        data.user = Number(req.userId); 
        console.log(data);
        const price = await priceService.postPrice(data);
        if(price){
            sendSuccess(res, price);
        }
        else{
            sendError(res, "El precio no pudo ser creado", 500); // TO DO: manejar errores específicos
        }
    }
    catch(error: any){
        sendError(res, error.message);
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