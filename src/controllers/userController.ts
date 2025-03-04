import { Request, Response } from 'express';
import userService from '../services/userService';
import { sendError, sendSuccess } from '../utils/requestHandlers';

class UserController {

    async getAllUsers(_req: Request, res: Response){
        try{
            const users = await userService.getAllUsers();
            sendSuccess(res, users);
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async getUserById(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const user = await userService.getUserById(id);
            if(user){
                sendSuccess(res, user);
            }
            else{
                sendError(res, "User not found", 404);
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async postUser(req: Request, res: Response){
        try{
            const data = req.body; // TO DO: validar datos del body en el back
            const user = await userService.postUser(data);
            if(user){
                sendSuccess(res, user);
            }
            else{
                sendError(res, "User could not be created", 500); // TO DO: manejar errores específicos
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }

    async putUser(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const data = req.body; // TO DO: validar datos del body en el back
            const user = await userService.putUser(id, data);
            if(user){
                sendSuccess(res, user);
            }
            else{
                sendError(res, "User not found", 404); // TO DO: manejar errores específicos
            }
        }
        catch(error: any){
            sendError(res, error.message);
        }
    }


}

export default new UserController();