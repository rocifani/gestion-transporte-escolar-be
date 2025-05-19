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
const axios_1 = __importDefault(require("axios"));
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
class mapsService {
    // Buscar lugares con un tipo específico (ej: "school")
    searchPlaces(query, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
                    params: {
                        query,
                        type,
                        language: "es",
                        key: GOOGLE_MAPS_API_KEY,
                    },
                });
                return response.data.results.map((place) => ({
                    place_id: place.place_id,
                    name: place.name,
                    address: place.formatted_address,
                }));
            }
            catch (error) {
                throw new Error("Error en la API de Google Places: " + error.message);
            }
        });
    }
    // Obtener detalles de un lugar usando place_id
    getPlaceDetails(place_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get("https://maps.googleapis.com/maps/api/place/details/json", {
                    params: {
                        place_id,
                        key: GOOGLE_MAPS_API_KEY,
                    },
                });
                return {
                    address: response.data.result.formatted_address,
                    lat: response.data.result.geometry.location.lat,
                    lng: response.data.result.geometry.location.lng,
                };
            }
            catch (error) {
                throw new Error("Error en la API de Google Place Details: " + error.message);
            }
        });
    }
    getPlaceIdFromText(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json", {
                    params: {
                        input: address,
                        inputtype: "textquery",
                        fields: "place_id",
                        key: GOOGLE_MAPS_API_KEY,
                    },
                });
                const candidates = response.data.candidates;
                return candidates.length > 0 ? candidates[0].place_id : null;
            }
            catch (error) {
                throw new Error("Error al obtener el place_id: " + error.message);
            }
        });
    }
    geocodeAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const placeId = yield this.getPlaceIdFromText(address);
                if (placeId) {
                    return yield this.getPlaceDetails(placeId);
                }
                const response = yield axios_1.default.get("https://maps.googleapis.com/maps/api/geocode/json", {
                    params: {
                        address,
                        key: GOOGLE_MAPS_API_KEY,
                    },
                });
                const location = response.data.results[0].geometry.location;
                return {
                    address: response.data.results[0].formatted_address,
                    lat: location.lat,
                    lng: location.lng,
                };
            }
            catch (error) {
                throw new Error("Error en la API de Google Geocoding: " + error.message);
            }
        });
    }
    geocodeAddresses(direcciones) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultados = [];
            for (const direccion of direcciones) {
                try {
                    const coordenada = yield this.geocodeAddress(direccion);
                    resultados.push(coordenada);
                }
                catch (error) {
                    throw new Error("Error: " + error.message);
                }
            }
            return resultados;
        });
    }
    ;
    calculateRouteWithDurations(locations) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get("https://maps.googleapis.com/maps/api/directions/json", {
                    params: {
                        origin: `${locations[0].lat},${locations[0].lng}`,
                        destination: `${locations[locations.length - 1].lat},${locations[locations.length - 1].lng}`,
                        waypoints: locations
                            .slice(1, -1)
                            .map(loc => `${loc.lat},${loc.lng}`)
                            .join("|"),
                        optimizeWaypoints: true,
                        key: GOOGLE_MAPS_API_KEY,
                    },
                });
                const legs = response.data.routes[0].legs;
                const totalDuration = legs.reduce((acc, leg) => acc + leg.duration.value, 0);
                const tramoDurations = legs.map((leg, i) => ({
                    from: locations[i].address,
                    to: locations[i + 1].address,
                    duration: leg.duration.value,
                    durationText: leg.duration.text,
                    steps: leg.steps,
                }));
                return {
                    totalDuration,
                    totalDurationText: `${Math.floor(totalDuration / 60)} minutos`,
                    legs: tramoDurations,
                };
            }
            catch (error) {
                throw new Error("Error al calcular la ruta: " + error.message);
            }
        });
    }
}
exports.default = new mapsService();
