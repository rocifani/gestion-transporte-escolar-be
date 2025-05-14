"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = __importDefault(require("../controllers/notificationController"));
const verifyToken_1 = __importDefault(require("../utils/verifyToken"));
const notificationRouter = (0, express_1.Router)();
notificationRouter.get("/:id", notificationController_1.default.getNotificationById);
notificationRouter.post("/", verifyToken_1.default, notificationController_1.default.postNotification);
notificationRouter.get("/", verifyToken_1.default, notificationController_1.default.getNotificationByUser);
notificationRouter.delete("/:id", verifyToken_1.default, notificationController_1.default.deleteNotification);
notificationRouter.put("/:id", verifyToken_1.default, notificationController_1.default.markNotificationAsRead);
exports.default = notificationRouter;
