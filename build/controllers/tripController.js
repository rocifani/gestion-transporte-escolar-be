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
const tripService_1 = __importDefault(require("../services/tripService"));
const requestHandlers_1 = require("../utils/requestHandlers");
class TripController {
    getAllTrips(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trips = yield tripService_1.default.getAllTrips();
                (0, requestHandlers_1.sendSuccess)(res, trips);
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    getTripById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params['id']);
                const trip = yield tripService_1.default.getTripById(id);
                if (trip) {
                    (0, requestHandlers_1.sendSuccess)(res, trip);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, "Trip not found", 404);
                }
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    postTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const requiredFields = ["available_capacity", "authorization"];
                const missingFields = requiredFields.filter(field => !data[field] && data[field] !== 0);
                if (missingFields.length > 0) {
                    return (0, requestHandlers_1.sendError)(res, `Faltan los siguientes campos: ${missingFields.join(", ")}`, 400);
                }
                if (isNaN(Number(data.available_capacity)) || Number(data.available_capacity) < 0) {
                    return (0, requestHandlers_1.sendError)(res, "La capacidad disponible debe ser un número positivo", 400);
                }
                const allowedStatuses = ["pending", "completed", "cancelled"];
                if (data.status && !allowedStatuses.includes(data.status)) {
                    return (0, requestHandlers_1.sendError)(res, `El estado debe ser uno de: ${allowedStatuses.join(", ")}`, 400);
                }
                if (data.date && isNaN(Date.parse(data.date))) {
                    return (0, requestHandlers_1.sendError)(res, "La fecha no es válida (debe ser ISO 8601)", 400);
                }
                const trip = yield tripService_1.default.postTrip(data);
                if (trip) {
                    (0, requestHandlers_1.sendSuccess)(res, trip);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, "El viaje no pudo ser creado", 500);
                }
            }
            catch (error) {
                if (error.code === '23503') {
                    (0, requestHandlers_1.sendError)(res, "La autorización especificada no existe", 400);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, error.message || "Error interno del servidor", 500);
                }
            }
        });
    }
    getTripByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.userId);
                if (!userId) {
                    return (0, requestHandlers_1.sendError)(res, "Acceso denegado", 401);
                }
                const trips = yield tripService_1.default.getTripByUser(userId);
                return (0, requestHandlers_1.sendSuccess)(res, trips);
            }
            catch (error) {
                return (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    getPaymentsByDriver(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.userId);
                if (!userId) {
                    return (0, requestHandlers_1.sendError)(res, "Acceso denegado", 401);
                }
                const trips = yield tripService_1.default.getPaymentsByDriver();
                return (0, requestHandlers_1.sendSuccess)(res, trips);
            }
            catch (error) {
                return (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    markTripsAsPaid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, month } = req.body;
            try {
                yield tripService_1.default.markTripsAsPaid(userId, month);
                res.status(200).json({ message: "Pagos marcados como realizados" });
            }
            catch (error) {
                return (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    startTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripId = parseInt(req.params.id);
            try {
                const result = yield tripService_1.default.startTrip(tripId);
                return (0, requestHandlers_1.sendSuccess)(res, result);
            }
            catch (error) {
                return (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    ;
    finishTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripId = parseInt(req.params.id);
            try {
                const result = yield tripService_1.default.finishTrip(tripId);
                return (0, requestHandlers_1.sendSuccess)(res, result);
            }
            catch (error) {
                return (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    ;
    cancelTripById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripId = parseInt(req.params.id);
            const cancelReason = req.body.rejectR;
            try {
                const result = yield tripService_1.default.cancelTripById(tripId, cancelReason);
                return (0, requestHandlers_1.sendSuccess)(res, result);
            }
            catch (error) {
                return (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
}
exports.default = new TripController();
