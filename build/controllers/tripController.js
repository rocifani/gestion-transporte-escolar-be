"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tripService_1 = __importDefault(require("../services/tripService"));
const requestHandlers_1 = require("../utils/requestHandlers");
class TripController {
    async getAllTrips(_req, res) {
        try {
            const trips = await tripService_1.default.getAllTrips();
            (0, requestHandlers_1.sendSuccess)(res, trips);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async getTripById(req, res) {
        try {
            const id = Number(req.params['id']);
            const trip = await tripService_1.default.getTripById(id);
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
    }
    postTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body; // TO DO: validar datos del body en el back
                const trip = yield tripService_1.default.postTrip(data);
                if (trip) {
                    (0, requestHandlers_1.sendSuccess)(res, trip);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, "Trip could not be created", 500); // TO DO: manejar errores específicos
                }
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    putTrip(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params['id']);
                const data = req.body; // TO DO: validar datos del body en el back
                const trip = yield tripService_1.default.putTrip(id, data);
                if (trip) {
                    (0, requestHandlers_1.sendSuccess)(res, trip);
                }
                else {
                    (0, requestHandlers_1.sendError)(res, "Trip not found", 404); // TO DO: manejar errores específicos
                }
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
}
exports.default = new TripController();
