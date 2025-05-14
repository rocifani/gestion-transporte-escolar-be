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
const requestHandlers_1 = require("../utils/requestHandlers");
const tripChildService_1 = __importDefault(require("../services/tripChildService"));
class TripController {
    getTripChildByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.userId);
                const trip_childs = yield tripChildService_1.default.getTripChildByUserId(userId);
                (0, requestHandlers_1.sendSuccess)(res, trip_childs);
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    getTripChildByTripId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripId = Number(req.params['trip_id']);
                const trip_childs = yield tripChildService_1.default.getTripChildByTripId(tripId);
                (0, requestHandlers_1.sendSuccess)(res, trip_childs);
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    getTripChildById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripChildId = Number(req.params['trip_child_id']);
                const trip_child = yield tripChildService_1.default.getTripChildById(tripChildId);
                (0, requestHandlers_1.sendSuccess)(res, trip_child);
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    getTripChildByChildId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const childId = Number(req.params['child_id']);
                const trip_childs = yield tripChildService_1.default.getTripChildByChildId(childId);
                (0, requestHandlers_1.sendSuccess)(res, trip_childs);
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
    deleteTripChild(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripChildId = Number(req.params['trip_child_id']);
                const deleted = yield tripChildService_1.default.deleteTripChild(tripChildId);
                (0, requestHandlers_1.sendSuccess)(res, deleted);
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
}
exports.default = new TripController();
