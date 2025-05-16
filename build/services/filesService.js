"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
class FilesService {
    async uploadToCloudinary(fileBuffer) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream((error, result) => {
                if (error) {
                    reject(new Error("Error al subir archivo a Cloudinary"));
                }
                else {
                    resolve(result.secure_url);
                }
            });
            streamifier_1.default.createReadStream(fileBuffer).pipe(stream);
        });
    }
}
exports.default = new FilesService();
