"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../libs/verifyToken");
const userController_1 = __importDefault(require("../controllers/userController"));
const userRouter = (0, express_1.Router)();
userRouter.get("/", userController_1.default.getAllUsers);
userRouter.get("/profile", verifyToken_1.TokenValidation, userController_1.default.getUserById);
userRouter.post("/signup", userController_1.default.signup);
userRouter.put("/:id", userController_1.default.putUser);
userRouter.post("/login", userController_1.default.login);
exports.default = userRouter;
