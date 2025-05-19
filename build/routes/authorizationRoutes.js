"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorizationController_1 = __importDefault(require("../controllers/authorizationController"));
const verifyToken_1 = __importDefault(require("../utils/verifyToken"));
const authorizationRouter = (0, express_1.Router)();
authorizationRouter.get("/", verifyToken_1.default, authorizationController_1.default.getAuthorizationByUser);
authorizationRouter.post("/", verifyToken_1.default, authorizationController_1.default.postAuthorization);
authorizationRouter.put("/:id", verifyToken_1.default, authorizationController_1.default.putAuthorization);
authorizationRouter.get("/all", authorizationController_1.default.getAllAuthorizations);
authorizationRouter.get("/:id", authorizationController_1.default.getAuthorizationById);
authorizationRouter.get("/child/:id", authorizationController_1.default.getChildAuthorizations);
exports.default = authorizationRouter;
