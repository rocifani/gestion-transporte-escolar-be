import { Request, Response } from 'express';
import userService from '../services/userService';
import { sendError, sendSuccess } from '../utils/requestHandlers';
import jwt from 'jsonwebtoken';

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
            const id = Number(req.userId);
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

    async login(req: Request, res: Response){
        try{
            const mail= req.body.email;
            const password= req.body.password;
            const user = await userService.login(mail, password);
            if(user){
                const token: string = jwt.sign({_id: user.id}, process.env.SECRET_TOKEN || 'tokentest', {expiresIn: '1h'});
                res.header('auth-token', token);
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

    async signup(req: Request, res: Response){ // esto es el signup
        try{
            const data = req.body; // TO DO: validar datos del body en el back
            
            //token
            const token: string = jwt.sign({_id: req.params['id']}, process.env.SECRET_TOKEN || 'tokentest'); 

            const user = await userService.signup(data);
            if(user){
                res.header('auth-token', token);
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