"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const childController_1 = __importDefault(require("../controllers/childController"));
const verifyToken_1 = __importDefault(require("../utils/verifyToken"));
const childRouter = (0, express_1.Router)();
childRouter.get("/:id", childController_1.default.getChildById);
childRouter.post("/", verifyToken_1.default, childController_1.default.postChild);
childRouter.put("/:id", verifyToken_1.default, childController_1.default.putChild);
childRouter.get("/", verifyToken_1.default, childController_1.default.getChildByUser);
childRouter.delete("/:id", verifyToken_1.default, childController_1.default.deleteChild);
exports.default = childRouter;
