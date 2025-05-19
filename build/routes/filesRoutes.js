"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const filesController_1 = __importDefault(require("../controllers/filesController"));
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const router = express_1.default.Router();
router.post("/upload", uploadMiddleware_1.default.single("file"), filesController_1.default.uploadFile);
router.post("/signature", filesController_1.default.getUploadSignature.bind(filesController_1.default));
exports.default = router;
