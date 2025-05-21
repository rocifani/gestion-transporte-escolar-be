"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const priceService_1 = __importDefault(require("../services/priceService"));
const requestHandlers_1 = require("../utils/requestHandlers");
class PriceController {
    async getAllPrices(_req, res) {
        try {
            const prices = await priceService_1.default.getAllPrices();
            (0, requestHandlers_1.sendSuccess)(res, prices);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async getPriceById(req, res) {
        try {
            const id = Number(req.params['id']);
            const price = await priceService_1.default.getPriceById(id);
            if (price) {
                (0, requestHandlers_1.sendSuccess)(res, price);
            }
            else {
                (0, requestHandlers_1.sendError)(res, "Price not found", 404);
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async postPrice(req, res) {
        try {
            const data = req.body;
            const requiredFields = ["monthly_price", "daily_price", "date_from"];
            const missingFields = requiredFields.filter(field => !data[field] && data[field] !== 0);
            if (missingFields.length > 0) {
                return (0, requestHandlers_1.sendError)(res, `Faltan los siguientes campos: ${missingFields.join(", ")}`, 400);
            }
            if (isNaN(Number(data.monthly_price)) || Number(data.monthly_price) < 0) {
                return (0, requestHandlers_1.sendError)(res, "El precio mensual debe ser un número válido", 400);
            }
            if (isNaN(Number(data.daily_price)) || Number(data.daily_price) < 0) {
                return (0, requestHandlers_1.sendError)(res, "El precio diario debe ser un número válido", 400);
            }
            data.user = Number(req.userId);
            const price = await priceService_1.default.postPrice(data);
            if (price) {
                (0, requestHandlers_1.sendSuccess)(res, price);
            }
            else {
                (0, requestHandlers_1.sendError)(res, "El precio no pudo ser creado", 500);
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message || "Error interno del servidor", 500);
        }
    }
    async getPriceByUser(req, res) {
        try {
            const userId = Number(req.userId);
            if (!userId) {
                return (0, requestHandlers_1.sendError)(res, "Acceso denegado", 401);
            }
            const prices = await priceService_1.default.getPriceByUser(userId);
            return (0, requestHandlers_1.sendSuccess)(res, prices);
        }
        catch (error) {
            return (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async getPriceByUserAuthorization(req, res) {
        try {
            const userId = Number(req.userId);
            if (!userId) {
                return (0, requestHandlers_1.sendError)(res, "Acceso denegado", 401);
            }
            const id = Number(req.params['id']);
            const price = await priceService_1.default.getPriceByUserAuthorization(id);
            return (0, requestHandlers_1.sendSuccess)(res, price);
        }
        catch (error) {
            return (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async deletePrice(req, res) {
        try {
            const id = Number(req.params['id']);
            const deleted = await priceService_1.default.deletePrice(id);
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
exports.default = new PriceController();
