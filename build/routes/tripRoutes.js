"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tripController_1 = __importDefault(require("../controllers/tripController"));
const tripRouter = (0, express_1.Router)();
tripRouter.get("/", tripController_1.default.getAllTrips);
tripRouter.get("/:id", tripController_1.default.getTripById);
tripRouter.post("/", tripController_1.default.postTrip);
tripRouter.put("/:id", tripController_1.default.putTrip);
exports.default = tripRouter;
