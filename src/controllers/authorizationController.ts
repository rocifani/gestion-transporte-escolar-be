import { Request, Response } from 'express';
import authorizationService from '../services/authorizationService';
import { sendError, sendSuccess } from '../utils/requestHandlers';
import  userService from '../services/userService';
import { sendNewAuthorizationNotification } from '../services/mailService';
import notificationService from '../services/notificationService';

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

    async postAuthorization(req: Request, res: Response) {
        try {
          const data = req.body;
          const requiredFields = [
            "driver_name", "dni", "school_name", "school_address", "work_shift",
            "vehicle_make", "vehicle_model", "vehicle_year", "vehicle_license_plate",
            "vehicle_capacity", "due_date_vehicle", "due_date_driver", "state"
          ];
      
          const missingFields = requiredFields.filter(field => !data[field]);
          if (missingFields.length > 0) {
            return sendError(res, `Faltan los siguientes campos: ${missingFields.join(", ")}`, 400);
          }
          if (isNaN(Number(data.vehicle_year))) {
            return sendError(res, "El año del vehículo debe ser un número", 400);
          }
          if (isNaN(Number(data.vehicle_capacity))) {
            return sendError(res, "La capacidad del vehículo debe ser un número", 400);
          }
          if (isNaN(Date.parse(data.due_date_vehicle))) {
            return sendError(res, "La fecha de vencimiento del vehículo no es válida", 400);
          }
          if (isNaN(Date.parse(data.due_date_driver))) {
            return sendError(res, "La fecha de vencimiento del conductor no es válida", 400);
          }
          data.user = Number(req.userId);
          const authorization = await authorizationService.postAuthorization(data);
          if (authorization) {
            sendSuccess(res, authorization);
            const admin = await userService.getAdminUser();
            const user = await userService.getUserById(Number(authorization.user));
            if (admin && user) {
                sendNewAuthorizationNotification(user.full_name, authorization.authorization_id, admin.email, admin.full_name);
                notificationService.postNotification({
                                                    notification_id: 0, 
                                                    title: "Nueva autorización creada",
                                                    detail: `Se ha solicitado la aprobación de una nueva autorización para ${user.full_name}. Por favor, ingresá a revisarla!`,
                                                    user: admin,
                                                    is_read: false,
                                                    created_at: new Date().toISOString(),
                                                    updated_at: new Date().toISOString()
                                                });
            } else {
                console.error("Admin user not found");
            }
          } else {
            sendError(res, "La habilitación no pudo ser creada", 500);
          }
        } catch (error: any) {
          if (error.code === '23505') {
            sendError(res, "Ya existe una autorización con esa patente", 400);
          } else {
            sendError(res, error.message || "Error interno del servidor", 500);
          }
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

    async getChildAuthorizations(req: Request, res: Response) {
        try {
            const childId = Number(req.params['id']); 
            if (!childId) {
                console.log(childId);
                return sendError(res, "Acceso denegado", 401); 
            }
            const authorizations = await authorizationService.getChildAuthorizations(childId);
            return sendSuccess(res, authorizations); 
        } 
        catch (error: any) {
            return sendError(res, error.message); 
        }
    }

    async getUsersWithAuthorization(_req: Request, res: Response) {
      try{
        const users = await authorizationService.getUsersWithAuthorizations();
        sendSuccess(res, users);
      }
      catch(error: any){
          sendError(res, error.message);
      }
    }
}

export default new AuthorizationController();