"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tripController_1 = __importDefault(require("../controllers/tripController"));
const verifyToken_1 = __importDefault(require("../utils/verifyToken"));
const tripRouter = (0, express_1.Router)();
tripRouter.get("/price", verifyToken_1.default, tripController_1.default.getPaymentsByDriver);
tripRouter.get("/", verifyToken_1.default, tripController_1.default.getTripByUser);
tripRouter.get("/:id", tripController_1.default.getTripById);
tripRouter.get("/", tripController_1.default.getAllTrips);
tripRouter.put("/pay", verifyToken_1.default, tripController_1.default.markTripsAsPaid);
tripRouter.post("/start/:id", verifyToken_1.default, tripController_1.default.startTrip);
tripRouter.post("/finish/:id", verifyToken_1.default, tripController_1.default.finishTrip);
tripRouter.post("/cancel/:id", verifyToken_1.default, tripController_1.default.cancelTripById);
tripRouter.post("/", tripController_1.default.postTrip);
exports.default = tripRouter;
