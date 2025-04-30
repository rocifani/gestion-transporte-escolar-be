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

    async postChild(req: Request, res: Response) {
        try {
          const data = req.body;
          const requiredFields = [
            "name", "last_name", "age", "school_name", "school_address", "school_shift"
          ];
          const missingFields = requiredFields.filter(field => !data[field]);
          if (missingFields.length > 0) {
            return sendError(res, `Faltan los siguientes campos: ${missingFields.join(", ")}`, 400);
          }
          if (isNaN(Number(data.age)) || Number(data.age) <= 0) {
            return sendError(res, "La edad debe ser un número positivo", 400);
          }
          data.user = Number(req.userId);
          const child = await childService.postChild(data);
          if (child) {
            sendSuccess(res, child);
          } else {
            sendError(res, "El niño no pudo ser creado", 500); 
          }
        } catch (error: any) {
          if (error.code === '23505') {
            sendError(res, "Ya existe un registro con los mismos datos", 400); 
          } else {
            sendError(res, error.message || "Error interno del servidor", 500);
          }
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

    async deleteChild(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const deleted = await childService.deleteChild(id);
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

export default new ChildController();