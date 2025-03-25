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
const db_1 = __importDefault(require("../database/db"));
class TripService {
    getAllTrips() {
        return __awaiter(this, void 0, void 0, function* () {
            const trips = yield db_1.default.query("SELECT * FROM trip");
            return trips;
        });
    }
    getTripById(trip_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const trip = yield db_1.default.query("SELECT * FROM trip WHERE trip_id = ?", trip_id);
            if (Array.isArray(trip) && trip.length > 0) {
                return trip[0];
            }
            return undefined;
        });
    }
    postTrip(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query("INSERT INTO trip SET ?", data);
            if (result.insertId) {
                return yield this.getTripById(result.insertId);
            }
            return undefined;
        });
    }
    putTrip(trip_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query("UPDATE trip SET ? WHERE trip_id = ?", [data, trip_id]);
            if (result.affectedRows) {
                return yield this.getTripById(trip_id);
            }
            return undefined;
        });
    }
}
exports.default = new TripService();
