import { Request, Response } from 'express';
import childService from '../services/childService';
import { sendError, sendSuccess } from '../utils/requestHandlers';

class ChildController {

    async getAllChildren(_req: Request, res: Response){
        try{
            const children = await childService.getAllChildren();
            sendSuccess(res, children);
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getChildById(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const child = await childService.getChildById(id);
            if(child){
                sendSuccess(res, child);
            }
            else{
                sendError(res, "Child not found", 404);
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async postChild(req: Request, res: Response){
    try{
        const data = req.body; // TO DO: validar datos del body en el back
        data.user = Number(req.userId); 
        const child = await childService.postChild(data);
        if(child){
            sendSuccess(res, child);
        }
        else{
            sendError(res, "El vehiculo no pudo ser creado", 500); // TO DO: manejar errores específicos
        }
    }
    catch(error: any){
        sendError(res, error.message);
    }
}

    async putChild(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const data = req.body; // TO DO: validar datos del body en el back
            const child = await childService.putChild(id, data);
            if(child){
                sendSuccess(res, child);
            }
            else{
                sendError(res, "Child not found", 404); // TO DO: manejar errores específicos
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getChildByUser(req: Request, res: Response) {
        try {
            const userId = Number(req.userId); 
            if (!userId) {
                return sendError(res, "Acceso denegado", 401); 
            }
            const children = await childService.getChildByUser(userId);
            return sendSuccess(res, children); 
        } 
        catch (error: any) {
            return sendError(res, error.message); 
        }
    }


}

export default new ChildController();