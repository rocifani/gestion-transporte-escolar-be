"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mapsService_1 = __importDefault(require("../services/mapsService"));
const tripChildService_1 = __importDefault(require("../services/tripChildService"));
const tripService_1 = __importDefault(require("../services/tripService"));
const requestHandlers_1 = require("../utils/requestHandlers");
class mapsController {
    async searchPlaces(req, res) {
        try {
            const { query, type } = req.query;
            if (!query) {
                return (0, requestHandlers_1.sendError)(res, "El parámetro 'query' es obligatorio", 400);
            }
            const places = await mapsService_1.default.searchPlaces(query, type);
            (0, requestHandlers_1.sendSuccess)(res, places);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async getPlaceDetails(req, res) {
        try {
            const { place_id } = req.query;
            if (!place_id) {
                return (0, requestHandlers_1.sendError)(res, "El parámetro 'place_id' es obligatorio", 400);
            }
            const details = await mapsService_1.default.getPlaceDetails(place_id);
            (0, requestHandlers_1.sendSuccess)(res, details);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async geocodeAddress(req, res) {
        try {
            const { address } = req.query;
            if (!address) {
                return (0, requestHandlers_1.sendError)(res, "El parámetro 'address' es obligatorio", 400);
            }
            const location = await mapsService_1.default.geocodeAddress(address);
            (0, requestHandlers_1.sendSuccess)(res, location);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async geocodeAddresses(req, res) {
        try {
            const { id } = req.params;
            const driver_address = await tripService_1.default.getDriverAddressByTripId(Number(id));
            const addresses = await tripChildService_1.default.getParentAddressesByTripId(Number(id));
            const school = await tripService_1.default.getSchoolByTripId(Number(id));
            console.log("Dirección del conductor:", driver_address);
            console.log("Direcciones de los padres:", addresses);
            console.log("Dirección de la escuela:", school);
            if (!addresses || !Array.isArray(addresses)) {
                return (0, requestHandlers_1.sendError)(res, "No se está recibiendo un array", 400);
            }
            const allAddresses = [driver_address, ...addresses, school];
            const locations = await mapsService_1.default.geocodeAddresses(allAddresses);
            const routeInfo = await mapsService_1.default.calculateRouteWithDurations(locations);
            (0, requestHandlers_1.sendSuccess)(res, {
                locations,
                routeSummary: routeInfo,
            });
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
}
exports.default = new mapsController();
