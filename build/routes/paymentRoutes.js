"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = __importDefault(require("../controllers/paymentController"));
const paymentRouter = (0, express_1.Router)();
paymentRouter.post("/webhook", paymentController_1.default.handleWebhook);
paymentRouter.post("/", paymentController_1.default.createPayment);
paymentRouter.get("/success", (_req, res) => {
    res.send("Payment successful");
});
exports.default = paymentRouter;
