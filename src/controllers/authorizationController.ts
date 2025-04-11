import { Request, Response } from 'express';
import authorizationService from '../services/authorizationService';
import { sendError, sendSuccess } from '../utils/requestHandlers';

class AuthorizationController {

    async getAllAuthorizations(_req: Request, res: Response){
        try{
            const authorizations = await authorizationService.getAllAuthorizations();
            sendSuccess(res, authorizations);
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getAuthorizationById(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const authorization = await authorizationService.getAuthorizationById(id);
            if(authorization){
                sendSuccess(res, authorization);
            }
            else{
                sendError(res, "Habilitacion no encontrada", 404);
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async postAuthorization(req: Request, res: Response){
        try{
            const data = req.body; // TO DO: validar datos del body en el back
            data.user = Number(req.userId); 
            const authorization = await authorizationService.postAuthorization(data);
            if(authorization){
                sendSuccess(res, authorization);
            }
            else{
                sendError(res, "La habilitacion no pudo ser creada", 500); // TO DO: manejar errores específicos
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async putAuthorization(req: Request, res: Response){
        try{
            const id = Number(req.params['id']); 
            const data = req.body;
            const authorization = await authorizationService.putAuthorization(id, data);
            if(authorization){
                sendSuccess(res, authorization);
            }
            else{
                sendError(res, "Habilitacion no encontrada", 404); // TO DO: manejar errores específicos
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getAuthorizationByUser(req: Request, res: Response) {
        try {
            const userId = Number(req.userId); 
            if (!userId) {
                return sendError(res, "Acceso denegado", 401); 
            }
            const authorizations = await authorizationService.getAuthorizationByUser(userId);
            return sendSuccess(res, authorizations); 
        } 
        catch (error: any) {
            return sendError(res, error.message); 
        }
    }
}

export default new AuthorizationController();