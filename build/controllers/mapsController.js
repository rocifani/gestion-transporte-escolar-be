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
const mapsService_1 = __importDefault(require("../services/mapsService"));
const tripChildService_1 = __importDefault(require("../services/tripChildService"));
const tripService_1 = __importDefault(require("../services/tripService"));
const requestHandlers_1 = require("../utils/requestHandlers");
class mapsController {
    searchPlaces(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query, type } = req.query;
                if (!query) {
                    return (0, requestHandlers_1.sendError)(res, "El parámetro 'query' es obligatorio", 400);
                }
                const places = yield mapsService_1.default.searchPlaces(query, type);
                (0, requestHandlers_1.sendSuccess)(res, places);
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    getPlaceDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { place_id } = req.query;
                if (!place_id) {
                    return (0, requestHandlers_1.sendError)(res, "El parámetro 'place_id' es obligatorio", 400);
                }
                const details = yield mapsService_1.default.getPlaceDetails(place_id);
                (0, requestHandlers_1.sendSuccess)(res, details);
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    geocodeAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { address } = req.query;
                if (!address) {
                    return (0, requestHandlers_1.sendError)(res, "El parámetro 'address' es obligatorio", 400);
                }
                const location = yield mapsService_1.default.geocodeAddress(address);
                (0, requestHandlers_1.sendSuccess)(res, location);
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    geocodeAddresses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const driver_address = yield tripService_1.default.getDriverAddressByTripId(Number(id));
                const addresses = yield tripChildService_1.default.getParentAddressesByTripId(Number(id));
                const school = yield tripService_1.default.getSchoolByTripId(Number(id));
                console.log("Dirección del conductor:", driver_address);
                console.log("Direcciones de los padres:", addresses);
                console.log("Dirección de la escuela:", school);
                if (!addresses || !Array.isArray(addresses)) {
                    return (0, requestHandlers_1.sendError)(res, "No se está recibiendo un array", 400);
                }
                const allAddresses = [driver_address, ...addresses, school];
                const locations = yield mapsService_1.default.geocodeAddresses(allAddresses);
                const routeInfo = yield mapsService_1.default.calculateRouteWithDurations(locations);
                (0, requestHandlers_1.sendSuccess)(res, {
                    locations,
                    routeSummary: routeInfo,
                });
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
}
exports.default = new mapsController();
