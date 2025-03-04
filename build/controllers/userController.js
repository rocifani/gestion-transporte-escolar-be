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
                const id = Number(req.params['id']);
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
    postUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body; // TO DO: validar datos del body en el back
                const user = yield userService_1.default.postUser(data);
                if (user) {
                    (0, requestHandlers_1.sendSuccess)(res, user);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, "User could not be created", 500); // TO DO: manejar errores específicos
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
                const data = req.body; // TO DO: validar datos del body en el back
                const user = yield userService_1.default.putUser(id, data);
                if (user) {
                    (0, requestHandlers_1.sendSuccess)(res, user);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, "User not found", 404); // TO DO: manejar errores específicos
                }
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
}
exports.default = new UserController();
