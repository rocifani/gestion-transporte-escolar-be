"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../utils/verifyToken");
const userController_1 = __importDefault(require("../controllers/userController"));
const userRouter = (0, express_1.Router)();
userRouter.get("/", userController_1.default.getAllUsers);
userRouter.get("/profile", verifyToken_1.TokenValidation, userController_1.default.getUserById);
userRouter.post("/signup", userController_1.default.signup);
userRouter.put("/update", verifyToken_1.TokenValidation, userController_1.default.putUser);
userRouter.post("/login", userController_1.default.login);
userRouter.get("/confirm-email/:token", userController_1.default.confirmEmail);
userRouter.post("/forgot-password", userController_1.default.forgotPassword);
userRouter.post("/reset-password/:token", userController_1.default.resetPassword);
userRouter.post("/signup-google", userController_1.default.loginWithGoogle);
exports.default = userRouter;
