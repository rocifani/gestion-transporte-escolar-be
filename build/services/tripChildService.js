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
const typeorm_1 = require("typeorm");
const db_1 = __importDefault(require("../database/db"));
const child_1 = require("../models/child");
const trip_1 = require("../models/trip");
const trip_child_1 = require("../models/trip_child");
class TripChildService {
    postTripChild(trip_id, child_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
            const tripChild = new trip_child_1.TripChild();
            const trip = yield db_1.default.getRepository(trip_1.Trip).findOne({ where: { trip_id } });
            if (!trip) {
                throw new Error(`Trip with id ${trip_id} not found`);
            }
            tripChild.trip = trip;
            const child = yield db_1.default.getRepository(child_1.Child).findOne({ where: { child_id } });
            if (!child) {
                throw new Error(`Child with id ${child_id} not found`);
            }
            tripChild.child = child;
            const result = yield tripChildRepository.save(tripChild);
            return result !== null && result !== void 0 ? result : undefined;
        });
    }
    getTripChildById(trip_child_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
            const tripChild = yield tripChildRepository.findOne({
                where: { trip_child_id, deleted_at: (0, typeorm_1.IsNull)() },
                relations: ["trip", "child", "trip.authorization"]
            });
            return tripChild !== null && tripChild !== void 0 ? tripChild : undefined;
        });
    }
    getTripChildByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
            const tripChildren = yield tripChildRepository
                .createQueryBuilder("trip_child")
                .leftJoinAndSelect("trip_child.child", "child")
                .leftJoinAndSelect("trip_child.trip", "trip")
                .leftJoin("child.user", "user")
                .where("user.id = :user_id", { user_id })
                .andWhere("trip_child.deleted_at IS NULL")
                .getMany();
            return tripChildren;
        });
    }
    getTripChildByTripId(trip_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
            const tripChildren = yield tripChildRepository
                .createQueryBuilder("trip_child")
                .leftJoinAndSelect("trip_child.child", "child")
                .leftJoin("child.user", "user")
                .where("trip_child.trip = :trip_id", { trip_id })
                .andWhere("trip_child.deleted_at IS NULL")
                .getMany();
            return tripChildren;
        });
    }
    getTripChildByChildId(child_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
            const tripChildren = yield tripChildRepository
                .createQueryBuilder("trip_child")
                .leftJoinAndSelect("trip_child.trip", "trip")
                .leftJoinAndSelect("trip_child.child", "child")
                .where("child.child_id = :child_id", { child_id })
                .andWhere("trip_child.deleted_at IS NULL")
                .getMany();
            return tripChildren;
        });
    }
    getParentAddressesByTripId(trip_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
            const tripChildren = yield tripChildRepository
                .createQueryBuilder("trip_child")
                .leftJoin("trip_child.child", "child")
                .leftJoin("child.user", "user")
                .select("user.address", "address")
                .where("trip_child.trip = :tripId", { tripId: trip_id })
                .andWhere("trip_child.deleted_at IS NULL")
                .getRawMany();
            return tripChildren.map(item => item.address);
        });
    }
    deleteTripChild(trip_child_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
            const tripChild = yield tripChildRepository.findOne({ where: { trip_child_id, deleted_at: (0, typeorm_1.IsNull)() } });
            if (tripChild) {
                tripChild.deleted_at = new Date().toString();
                yield tripChildRepository.save(tripChild);
                return true;
            }
            return false;
        });
    }
}
exports.default = new TripChildService();
