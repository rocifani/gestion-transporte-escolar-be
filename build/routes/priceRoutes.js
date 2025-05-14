"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const priceController_1 = __importDefault(require("../controllers/priceController"));
const verifyToken_1 = __importDefault(require("../utils/verifyToken"));
const priceRouter = (0, express_1.Router)();
priceRouter.get("/", verifyToken_1.default, priceController_1.default.getPriceByUser);
priceRouter.post("/", verifyToken_1.default, priceController_1.default.postPrice);
priceRouter.get("/authorization/:id", verifyToken_1.default, priceController_1.default.getPriceByUserAuthorization);
priceRouter.get("/all", priceController_1.default.getAllPrices);
priceRouter.get("/:id", priceController_1.default.getPriceById);
exports.default = priceRouter;
