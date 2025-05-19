"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const requestHandlers_1 = require("../utils/requestHandlers");
const filesService_1 = __importDefault(require("../services/filesService"));
const crypto_1 = __importDefault(require("crypto"));
class FilesController {
    constructor() {
        this.generateSignature = (params) => {
            const sortedParams = Object.keys(params)
                .sort()
                .map((key) => `${key}=${params[key]}`)
                .join('&');
            return crypto_1.default
                .createHmac('sha256', process.env.CLOUDINARY_API_SECRET)
                .update(sortedParams)
                .digest('hex');
        };
        this.getUploadSignature = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = Math.round(new Date().getTime() / 1000);
                try {
                    const signature = this.generateSignature({ timestamp: timestamp.toString(), folder: "uploads" });
                    console.log("Firma generada:", signature);
                    return (0, requestHandlers_1.sendSuccess)(res, {
                        signature,
                        timestamp,
                        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                        api_key: process.env.CLOUDINARY_API_KEY,
                    });
                }
                catch (error) {
                    console.error("Error llamando a generateSignature:", error);
                    return (0, requestHandlers_1.sendError)(res, "Error al generar la firma", 500);
                }
            }
            catch (error) {
                return (0, requestHandlers_1.sendError)(res, "Error al generar la firma", 500);
            }
        });
    }
    uploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    return (0, requestHandlers_1.sendError)(res, "No se ha subido ningún archivo", 400);
                }
                const secureUrl = yield filesService_1.default.uploadToCloudinary(req.file.buffer);
                return (0, requestHandlers_1.sendSuccess)(res, { url: secureUrl });
            }
            catch (error) {
                (0, requestHandlers_1.sendError)(res, error.message);
            }
        });
    }
}
exports.default = new FilesController();
