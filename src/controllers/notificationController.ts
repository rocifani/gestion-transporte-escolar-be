import { Request, Response } from 'express';
import notificationService from '../services/notificationService';
import { sendError, sendSuccess } from '../utils/requestHandlers';

class NotificationController {

    async getAllNotifications(_req: Request, res: Response){
        try{
            const prices = await notificationService.getAllNotifications();
            sendSuccess(res, prices);
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getNotificationById(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const price = await notificationService.getNotificationById(id);
            if(price){
                sendSuccess(res, price);
            }
            else{
                sendError(res, "Notification not found", 404);
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async postNotification(req: Request, res: Response) {
        try {
          const data = req.body;
          const requiredFields = ["title", "detail"];
          const missingFields = requiredFields.filter(field => !data[field] && data[field] !== 0);
          if (missingFields.length > 0) {
            return sendError(res, `Faltan los siguientes campos: ${missingFields.join(", ")}`, 400);
          }
          data.user = Number(req.userId);
          const price = await notificationService.postNotification(data);
          if (price) {
            sendSuccess(res, price);
          } else {
            sendError(res, "El notificacion no pudo ser creado", 500);
          }
        } catch (error: any) {
            sendError(res, error.message || "Error interno del servidor", 500);
        }
      }

   
    async getNotificationByUser(req: Request, res: Response) {
        try {
            const userId = Number(req.userId); 
            if (!userId) {
                return sendError(res, "Acceso denegado", 401); 
            }
            const notifications = await notificationService.getNotificationByUser(userId);
            return sendSuccess(res, notifications); 
        } 
        catch (error: any) {
            return sendError(res, error.message); 
        }
    }

    async deleteNotification(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const deleted = await notificationService.deleteNotification(id);
            if(deleted){
                sendSuccess(res, "Notificacion eliminado correctamente");
            }
            else{
                sendError(res, "Notificacion no encontrado", 404); 
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async markNotificationAsRead(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const updated = await notificationService.markNotificationAsRead(id);
            console.log(updated);
            if(updated){
                sendSuccess(res, "Notificacion marcado como leido correctamente");
            }
            else{
                sendError(res, "Notificacion no encontrado", 404); 
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

}

export default new NotificationController();