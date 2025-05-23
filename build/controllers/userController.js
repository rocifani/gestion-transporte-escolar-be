"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../services/userService"));
const requestHandlers_1 = require("../utils/requestHandlers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validators_1 = require("../utils/validators");
const mailService_1 = require("../services/mailService");
class UserController {
    async getAllUsers(_req, res) {
        try {
            const users = await userService_1.default.getAllUsers();
            (0, requestHandlers_1.sendSuccess)(res, users);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async getUserById(req, res) {
        try {
            const id = Number(req.userId);
            const user = await userService_1.default.getUserById(id);
            if (user) {
                (0, requestHandlers_1.sendSuccess)(res, user);
            }
            else {
                (0, requestHandlers_1.sendError)(res, "Usuario no encontrado", 404);
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async login(req, res) {
        try {
            const mail = req.body.email;
            const password = req.body.password;
            const user = await userService_1.default.login(mail, password);
            if (user) {
                const token = jsonwebtoken_1.default.sign({ _id: user.id, role_id: user.role_id }, process.env.SECRET_TOKEN || 'tokentest', { expiresIn: '1h' });
                res.json({
                    token,
                    user: {
                        id: user.id,
                        full_name: user.full_name,
                        email: user.email,
                        role_id: user.role_id
                    }
                });
            }
            else {
                (0, requestHandlers_1.sendError)(res, "El mail y/o la contraseña son incorrectos.", 404);
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async signup(req, res) {
        try {
            const data = req.body;
            const existingUser = await userService_1.default.getUserByEmail(req.body.email);
            if (existingUser) {
                return (0, requestHandlers_1.sendError)(res, "El email ya está registrado. Intente con otro o inicie sesión", 400);
            }
            if (!req.body.email || !req.body.password || !req.body.full_name || !req.body.role_id) {
                return (0, requestHandlers_1.sendError)(res, "Todos los campos son obligatorios", 400);
            }
            if (!(0, validators_1.isValidEmail)(req.body.email)) {
                return (0, requestHandlers_1.sendError)(res, "El formato del email es inválido", 400);
            }
            if (!(0, validators_1.isValidPassword)(req.body.password)) {
                return (0, requestHandlers_1.sendError)(res, "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número", 400);
            }
            const user = await userService_1.default.signup(data);
            if (user) {
                const token = jsonwebtoken_1.default.sign({ _id: user.id, role_id: user.role_id }, process.env.SECRET_TOKEN || 'tokentest', { expiresIn: '1h' });
                (0, mailService_1.sendConfirmationEmail)(user.email, token);
                res.json({
                    token,
                    user: {
                        id: user.id,
                        full_name: user.full_name,
                        email: user.email,
                        role_id: user.role_id
                    }
                });
            }
            else {
                (0, requestHandlers_1.sendError)(res, "No se pudo crear el usuario", 500);
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async confirmEmail(req, res) {
        try {
            const { token } = req.params;
            if (!token) {
                return (0, requestHandlers_1.sendError)(res, "Token inválido", 400);
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN || 'tokentest');
            const user = await userService_1.default.getUserById(decoded._id);
            if (!user) {
                return (0, requestHandlers_1.sendError)(res, "Usuario no encontrado", 404);
            }
            if (user.is_confirmed) {
                return (0, requestHandlers_1.sendError)(res, "El usuario ya ha sido confirmado", 400);
            }
            else {
                await userService_1.default.confirmUser(decoded._id);
            }
            await userService_1.default.confirmUser(decoded._id);
            (0, requestHandlers_1.sendSuccess)(res, "Cuenta confirmada exitosamente");
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, "Token inválido o expirado", 400);
        }
    }
    async putUser(req, res) {
        try {
            const id = Number(req.userId);
            const data = req.body;
            const user = await userService_1.default.putUser(id, data);
            if (user) {
                (0, requestHandlers_1.sendSuccess)(res, user);
            }
            else {
                (0, requestHandlers_1.sendError)(res, "Usuario no encontrado", 404);
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async forgotPassword(req, res) {
        try {
            const email = req.body.email;
            const user = await userService_1.default.getUserByEmail(email);
            if (!user) {
                return (0, requestHandlers_1.sendError)(res, "Usuario no encontrado", 404);
            }
            else {
                const token = jsonwebtoken_1.default.sign({ _id: user.id, role_id: user.role_id }, process.env.SECRET_TOKEN || 'tokentest', { expiresIn: '1h' });
                (0, mailService_1.sendForgotPasswordEmail)(user.email, token);
                (0, requestHandlers_1.sendSuccess)(res, "Email enviado exitosamente");
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async resetPassword(req, res) {
        try {
            const { token } = req.params;
            const { password } = req.body;
            if (!token) {
                return (0, requestHandlers_1.sendError)(res, "Token inválido", 400);
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN || 'tokentest');
            const user = await userService_1.default.getUserById(decoded._id);
            if (!user) {
                return (0, requestHandlers_1.sendError)(res, "Usuario no encontrado", 404);
            }
            user.password = password;
            await userService_1.default.putUser(decoded._id, user);
            (0, requestHandlers_1.sendSuccess)(res, "Contraseña actualizada exitosamente");
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, "Token inválido o expirado", 400);
        }
    }
    async loginWithGoogle(req, res) {
        try {
            const email = req.body.email;
            const data = req.body;
            let user = await userService_1.default.getUserByEmail(email);
            if (!user) {
                user = await userService_1.default.signUpWithGoogle(data);
            }
            else {
                const token = jsonwebtoken_1.default.sign({ _id: user.id, role_id: user.role_id }, process.env.SECRET_TOKEN || 'tokentest', { expiresIn: '1h' });
                res.json({
                    token,
                    user: {
                        id: user.id,
                        full_name: user.full_name,
                        email: user.email,
                        role_id: user.role_id,
                        photo_picture: user.profile_picture,
                        phone_number: user.phone_number,
                        birth_date: user.birth_date,
                        is_confirmed: user.is_confirmed
                    }
                });
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
}
exports.default = new UserController();
