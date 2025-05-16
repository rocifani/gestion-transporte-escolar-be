"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const requestHandlers_1 = require("../utils/requestHandlers");
const tripChildService_1 = __importDefault(require("../services/tripChildService"));
class TripController {
    async getTripChildByUserId(req, res) {
        try {
            const userId = Number(req.userId);
            const trip_childs = await tripChildService_1.default.getTripChildByUserId(userId);
            (0, requestHandlers_1.sendSuccess)(res, trip_childs);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async getTripChildByTripId(req, res) {
        try {
            const tripId = Number(req.params['trip_id']);
            const trip_childs = await tripChildService_1.default.getTripChildByTripId(tripId);
            (0, requestHandlers_1.sendSuccess)(res, trip_childs);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async getTripChildById(req, res) {
        try {
            const tripChildId = Number(req.params['trip_child_id']);
            const trip_child = await tripChildService_1.default.getTripChildById(tripChildId);
            (0, requestHandlers_1.sendSuccess)(res, trip_child);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async getTripChildByChildId(req, res) {
        try {
            const childId = Number(req.params['child_id']);
            const trip_childs = await tripChildService_1.default.getTripChildByChildId(childId);
            (0, requestHandlers_1.sendSuccess)(res, trip_childs);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
    async deleteTripChild(req, res) {
        try {
            const tripChildId = Number(req.params['trip_child_id']);
            const deleted = await tripChildService_1.default.deleteTripChild(tripChildId);
            (0, requestHandlers_1.sendSuccess)(res, deleted);
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
}
exports.default = new TripController();
