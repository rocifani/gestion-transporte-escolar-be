import { Request, Response } from 'express';
import userService from '../services/userService';
import { sendError, sendSuccess } from '../utils/requestHandlers';
import jwt from 'jsonwebtoken';
import { isValidEmail, isValidPassword } from '../utils/validators';

class UserController {

    async getAllUsers(_req: Request, res: Response){
        try {
            const users = await userService.getAllUsers();
            sendSuccess(res, users);
        } catch (error: any) {
            sendError(res, error.message);
        }
    }

    async getUserById(req: Request, res: Response){
        try{
            const id = Number(req.userId);
            const user = await userService.getUserById(id);
            if (user) {
                sendSuccess(res, user);
            } else {
                sendError(res, "User not found", 404);
            }
        } catch (error: any) {
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
            const data = req.body;
            const { email, password, full_name, role_id } = req.body;
            
            const existingUser = await userService.signup(email);
            if (existingUser) {
                return sendError(res, "El email ya está registrado", 400);
            }

            if (!email || !password || !full_name || !role_id) {
                return sendError(res, "Todos los campos son obligatorios", 400);
            }

            if (!isValidEmail(email)) {
                return sendError(res, "El formato del email es inválido", 400);
            }

            if (!isValidPassword(password)) {
                return sendError(res, "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número", 400);
            }
            
            //token
            const token: string = jwt.sign({_id: req.params['id']}, process.env.SECRET_TOKEN || 'tokentest'); 

            const user = await userService.signup(data);
            if(user){
                res.header('auth-token', token);
                sendSuccess(res, user);
            } else {
                sendError(res, "No se pudo crear el usuario", 500);
            }
        } catch (error: any) {
            sendError(res, error.message);
        }
    }



    async putUser(req: Request, res: Response){
        try{
            const id = Number(req.params['id']);
            const data = req.body;
            const user = await userService.putUser(id, data);
            if (user) {
                sendSuccess(res, user);
            } else {
                sendError(res, "Usuario no encontrado", 404);
            }
        } catch (error: any) {
            sendError(res, error.message);
        }
    }
}

export default new UserController();
