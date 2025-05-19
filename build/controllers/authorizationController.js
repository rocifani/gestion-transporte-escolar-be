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
const authorizationService_1 = __importDefault(require("../services/authorizationService"));
const requestHandlers_1 = require("../utils/requestHandlers");
const userService_1 = __importDefault(require("../services/userService"));
const mailService_1 = require("../services/mailService");
const notificationService_1 = __importDefault(require("../services/notificationService"));
class AuthorizationController {
    getAllAuthorizations(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authorizations = yield authorizationService_1.default.getAllAuthorizations();
                (0, requestHandlers_1.sendSuccess)(res, authorizations);
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    getAuthorizationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params['id']);
                const authorization = yield authorizationService_1.default.getAuthorizationById(id);
                if (authorization) {
                    (0, requestHandlers_1.sendSuccess)(res, authorization);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, "Habilitacion no encontrada", 404);
                }
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    postAuthorization(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const requiredFields = [
                    "driver_name", "dni", "school_name", "school_address", "work_shift",
                    "vehicle_make", "vehicle_model", "vehicle_year", "vehicle_license_plate",
                    "vehicle_capacity", "due_date_vehicle", "due_date_driver", "state"
                ];
                const missingFields = requiredFields.filter(field => !data[field]);
                if (missingFields.length > 0) {
                    return (0, requestHandlers_1.sendError)(res, `Faltan los siguientes campos: ${missingFields.join(", ")}`, 400);
                }
                if (isNaN(Number(data.vehicle_year))) {
                    return (0, requestHandlers_1.sendError)(res, "El año del vehículo debe ser un número", 400);
                }
                if (isNaN(Number(data.vehicle_capacity))) {
                    return (0, requestHandlers_1.sendError)(res, "La capacidad del vehículo debe ser un número", 400);
                }
                if (isNaN(Date.parse(data.due_date_vehicle))) {
                    return (0, requestHandlers_1.sendError)(res, "La fecha de vencimiento del vehículo no es válida", 400);
                }
                if (isNaN(Date.parse(data.due_date_driver))) {
                    return (0, requestHandlers_1.sendError)(res, "La fecha de vencimiento del conductor no es válida", 400);
                }
                data.user = Number(req.userId);
                const authorization = yield authorizationService_1.default.postAuthorization(data);
                if (authorization) {
                    (0, requestHandlers_1.sendSuccess)(res, authorization);
                    const admin = yield userService_1.default.getAdminUser();
                    const user = yield userService_1.default.getUserById(Number(authorization.user));
                    if (admin && user) {
                        (0, mailService_1.sendNewAuthorizationNotification)(user.full_name, authorization.authorization_id, admin.email, admin.full_name);
                        notificationService_1.default.postNotification({
                            notification_id: 0,
                            title: "Nueva autorización creada",
                            detail: `Se ha solicitado la aprobación de una nueva autorización para ${user.full_name}. Por favor, ingresá a revisarla!`,
                            user: admin,
                            is_read: false,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });
                    }
                    else {
                        console.error("Admin user not found");
                    }
                }
                else {
                    (0, requestHandlers_1.sendError)(res, "La habilitación no pudo ser creada", 500);
                }
            }
            catch (error) {
                if (error.code === '23505') {
                    (0, requestHandlers_1.sendError)(res, "Ya existe una autorización con esa patente", 400);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, error.message || "Error interno del servidor", 500);
                }
            }
        });
    }
    putAuthorization(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params['id']);
                const data = req.body;
                const authorization = yield authorizationService_1.default.putAuthorization(id, data);
                if (authorization) {
                    (0, requestHandlers_1.sendSuccess)(res, authorization);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, "Habilitacion no encontrada", 404); // TO DO: manejar errores específicos
                }
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    getAuthorizationByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.userId);
                if (!userId) {
                    return (0, requestHandlers_1.sendError)(res, "Acceso denegado", 401);
                }
                const authorizations = yield authorizationService_1.default.getAuthorizationByUser(userId);
                return (0, requestHandlers_1.sendSuccess)(res, authorizations);
            }
            catch (error) {
                return (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    getChildAuthorizations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const childId = Number(req.params['id']);
                if (!childId) {
                    console.log(childId);
                    return (0, requestHandlers_1.sendError)(res, "Acceso denegado", 401);
                }
                const authorizations = yield authorizationService_1.default.getChildAuthorizations(childId);
                return (0, requestHandlers_1.sendSuccess)(res, authorizations);
            }
            catch (error) {
                return (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    getUsersWithAuthorization(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield authorizationService_1.default.getUsersWithAuthorizations();
                (0, requestHandlers_1.sendSuccess)(res, users);
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
}
exports.default = new AuthorizationController();
