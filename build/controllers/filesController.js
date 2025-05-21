"use strict";
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
        this.getUploadSignature = async (_req, res) => {
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
        };
    }
    async uploadFile(req, res) {
        try {
            if (!req.file) {
                return (0, requestHandlers_1.sendError)(res, "No se ha subido ningún archivo", 400);
            }
            const secureUrl = await filesService_1.default.uploadToCloudinary(req.file.buffer);
            return (0, requestHandlers_1.sendSuccess)(res, { url: secureUrl });
        }
        catch (error) {
            (0, requestHandlers_1.sendError)(res, error.message);
        }
    }
}
exports.default = new FilesController();
