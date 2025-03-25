"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../services/userService"));
const requestHandlers_1 = require("../utils/requestHandlers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validators_1 = require("../utils/validators");
class UserController {
    getAllUsers(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userService_1.default.getAllUsers();
                (0, requestHandlers_1.sendSuccess)(res, users);
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.userId);
                const user = yield userService_1.default.getUserById(id);
                if (user) {
                    (0, requestHandlers_1.sendSuccess)(res, user);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, "User not found", 404);
                }
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mail = req.body.email;
                const password = req.body.password;
                const user = yield userService_1.default.login(mail, password);
                if (user) {
                    const token = jsonwebtoken_1.default.sign({ _id: user.id }, process.env.SECRET_TOKEN || 'tokentest', { expiresIn: '1h' });
                    res.header('auth-token', token);
                    (0, requestHandlers_1.sendSuccess)(res, user);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, "User not found", 404);
                }
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const existingUser = yield userService_1.default.getUserByEmail(req.body.email);
                if (existingUser) {
                    return (0, requestHandlers_1.sendError)(res, "El email ya está registrado", 400);
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
                //token
                const token = jsonwebtoken_1.default.sign({ _id: req.params['id'] }, process.env.SECRET_TOKEN || 'tokentest');
                const user = yield userService_1.default.signup(data);
                if (user) {
                    res.header('auth-token', token);
                    (0, requestHandlers_1.sendSuccess)(res, user);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, "No se pudo crear el usuario", 500);
                }
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    putUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params['id']);
                const data = req.body;
                const user = yield userService_1.default.putUser(id, data);
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
        });
    }
}
exports.default = new UserController();
