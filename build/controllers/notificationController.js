"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationService_1 = __importDefault(require("../services/notificationService"));
const requestHandlers_1 = require("../utils/requestHandlers");
class NotificationController {
    async getAllNotifications(_req, res) {
        try {
            const prices = await notificationService_1.default.getAllNotifications();
            (0, requestHandlers_1.sendSuccess)(res, prices);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async getNotificationById(req, res) {
        try {
            const id = Number(req.params['id']);
            const price = await notificationService_1.default.getNotificationById(id);
            if (price) {
                (0, requestHandlers_1.sendSuccess)(res, price);
            }
            else {
                (0, requestHandlers_1.sendError)(res, "Notification not found", 404);
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async postNotification(req, res) {
        try {
            const data = req.body;
            const requiredFields = ["title", "detail"];
            const missingFields = requiredFields.filter(field => !data[field] && data[field] !== 0);
            if (missingFields.length > 0) {
                return (0, requestHandlers_1.sendError)(res, `Faltan los siguientes campos: ${missingFields.join(", ")}`, 400);
            }
            data.user = Number(req.userId);
            const price = await notificationService_1.default.postNotification(data);
            if (price) {
                (0, requestHandlers_1.sendSuccess)(res, price);
            }
            else {
                (0, requestHandlers_1.sendError)(res, "El notificacion no pudo ser creado", 500);
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message || "Error interno del servidor", 500);
        }
    }
    async getNotificationByUser(req, res) {
        try {
            const userId = Number(req.userId);
            if (!userId) {
                return (0, requestHandlers_1.sendError)(res, "Acceso denegado", 401);
            }
            const notifications = await notificationService_1.default.getNotificationByUser(userId);
            return (0, requestHandlers_1.sendSuccess)(res, notifications);
        }
        catch (error) {
            return (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async deleteNotification(req, res) {
        try {
            const id = Number(req.params['id']);
            const deleted = await notificationService_1.default.deleteNotification(id);
            if (deleted) {
                (0, requestHandlers_1.sendSuccess)(res, "Notificacion eliminado correctamente");
            }
            else {
                (0, requestHandlers_1.sendError)(res, "Notificacion no encontrado", 404);
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async markNotificationAsRead(req, res) {
        try {
            const id = Number(req.params['id']);
            const updated = await notificationService_1.default.markNotificationAsRead(id);
            console.log(updated);
            if (updated) {
                (0, requestHandlers_1.sendSuccess)(res, "Notificacion marcado como leido correctamente");
            }
            else {
                (0, requestHandlers_1.sendError)(res, "Notificacion no encontrado", 404);
            }
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
}
exports.default = new NotificationController();
