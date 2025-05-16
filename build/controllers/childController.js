"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const childService_1 = __importDefault(require("../services/childService"));
const requestHandlers_1 = require("../utils/requestHandlers");
class ChildController {
    async getAllChildren(_req, res) {
        try {
            const children = await childService_1.default.getAllChildren();
            (0, requestHandlers_1.sendSuccess)(res, children);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async getChildById(req, res) {
        try {
            const id = Number(req.params['id']);
            const child = await childService_1.default.getChildById(id);
            if (child) {
                (0, requestHandlers_1.sendSuccess)(res, child);
            }
            else {
                (0, requestHandlers_1.sendError)(res, "Child not found", 404);
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async postChild(req, res) {
        try {
            const data = req.body;
            const requiredFields = [
                "name", "last_name", "age", "school_name", "school_address", "school_shift"
            ];
            const missingFields = requiredFields.filter(field => !data[field]);
            if (missingFields.length > 0) {
                return (0, requestHandlers_1.sendError)(res, `Faltan los siguientes campos: ${missingFields.join(", ")}`, 400);
            }
            if (isNaN(Number(data.age)) || Number(data.age) <= 0) {
                return (0, requestHandlers_1.sendError)(res, "La edad debe ser un número positivo", 400);
            }
            data.user = Number(req.userId);
            const child = await childService_1.default.postChild(data);
            if (child) {
                (0, requestHandlers_1.sendSuccess)(res, child);
            }
            else {
                (0, requestHandlers_1.sendError)(res, "El niño no pudo ser creado", 500);
            }
        }
        catch (error) {
            if (error.code === '23505') {
                (0, requestHandlers_1.sendError)(res, "Ya existe un registro con los mismos datos", 400);
            }
            else {
                (0, requestHandlers_1.sendError)(res, error.message || "Error interno del servidor", 500);
            }
        }
    }
    async putChild(req, res) {
        try {
            const id = Number(req.params['id']);
            const data = req.body; // TO DO: validar datos del body en el back
            const child = await childService_1.default.putChild(id, data);
            if (child) {
                (0, requestHandlers_1.sendSuccess)(res, child);
            }
            else {
                (0, requestHandlers_1.sendError)(res, "Child not found", 404); // TO DO: manejar errores específicos
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async getChildByUser(req, res) {
        try {
            const userId = Number(req.userId);
            if (!userId) {
                return (0, requestHandlers_1.sendError)(res, "Acceso denegado", 401);
            }
            const children = await childService_1.default.getChildByUser(userId);
            return (0, requestHandlers_1.sendSuccess)(res, children);
        }
        catch (error) {
            return (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async deleteChild(req, res) {
        try {
            const id = Number(req.params['id']);
            const deleted = await childService_1.default.deleteChild(id);
            if (deleted) {
                (0, requestHandlers_1.sendSuccess)(res, "Alumno eliminado correctamente");
            }
            else {
                (0, requestHandlers_1.sendError)(res, "Alumno no encontrado", 404);
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
}
exports.default = new ChildController();
