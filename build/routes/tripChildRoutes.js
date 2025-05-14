"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../utils/verifyToken"));
const tripChildController_1 = __importDefault(require("../controllers/tripChildController"));
const tripRouter = (0, express_1.Router)();
tripRouter.get("/", verifyToken_1.default, tripChildController_1.default.getTripChildByUserId);
tripRouter.get("/trips/:trip_id", tripChildController_1.default.getTripChildByTripId);
tripRouter.get("/:child_id", tripChildController_1.default.getTripChildByChildId);
tripRouter.get("/trip/:trip_child_id", tripChildController_1.default.getTripChildById);
tripRouter.delete("/:trip_child_id", verifyToken_1.default, tripChildController_1.default.deleteTripChild);
exports.default = tripRouter;
