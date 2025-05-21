"use strict";
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
    async postTripChild(trip_id, child_id) {
        const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
        const tripChild = new trip_child_1.TripChild();
        const trip = await db_1.default.getRepository(trip_1.Trip).findOne({ where: { trip_id } });
        if (!trip) {
            throw new Error(`Trip with id ${trip_id} not found`);
        }
        tripChild.trip = trip;
        const child = await db_1.default.getRepository(child_1.Child).findOne({ where: { child_id } });
        if (!child) {
            throw new Error(`Child with id ${child_id} not found`);
        }
        tripChild.child = child;
        const result = await tripChildRepository.save(tripChild);
        return result ?? undefined;
    }
    async getTripChildById(trip_child_id) {
        const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
        const tripChild = await tripChildRepository.findOne({
            where: { trip_child_id, deleted_at: (0, typeorm_1.IsNull)() },
            relations: ["trip", "child", "trip.authorization"]
        });
        return tripChild ?? undefined;
    }
    async getTripChildByUserId(user_id) {
        const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
        const tripChildren = await tripChildRepository
            .createQueryBuilder("trip_child")
            .leftJoinAndSelect("trip_child.child", "child")
            .leftJoinAndSelect("trip_child.trip", "trip")
            .leftJoin("child.user", "user")
            .where("user.id = :user_id", { user_id })
            .andWhere("trip_child.deleted_at IS NULL")
            .getMany();
        return tripChildren;
    }
    async getTripChildByTripId(trip_id) {
        const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
        const tripChildren = await tripChildRepository
            .createQueryBuilder("trip_child")
            .leftJoinAndSelect("trip_child.child", "child")
            .leftJoin("child.user", "user")
            .where("trip_child.trip = :trip_id", { trip_id })
            .andWhere("trip_child.deleted_at IS NULL")
            .getMany();
        return tripChildren;
    }
    async getTripChildByChildId(child_id) {
        const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
        const tripChildren = await tripChildRepository
            .createQueryBuilder("trip_child")
            .leftJoinAndSelect("trip_child.trip", "trip")
            .leftJoinAndSelect("trip_child.child", "child")
            .where("child.child_id = :child_id", { child_id })
            .andWhere("trip_child.deleted_at IS NULL")
            .getMany();
        return tripChildren;
    }
    async getParentAddressesByTripId(trip_id) {
        const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
        const tripChildren = await tripChildRepository
            .createQueryBuilder("trip_child")
            .leftJoin("trip_child.child", "child")
            .leftJoin("child.user", "user")
            .select("user.address", "address")
            .where("trip_child.trip = :tripId", { tripId: trip_id })
            .andWhere("trip_child.deleted_at IS NULL")
            .getRawMany();
        return tripChildren.map(item => item.address);
    }
    async deleteTripChild(trip_child_id) {
        const tripChildRepository = db_1.default.getRepository(trip_child_1.TripChild);
        const tripChild = await tripChildRepository.findOne({ where: { trip_child_id, deleted_at: (0, typeorm_1.IsNull)() } });
        if (tripChild) {
            tripChild.deleted_at = new Date().toString();
            await tripChildRepository.save(tripChild);
            return true;
        }
        return false;
    }
}
exports.default = new TripChildService();
