import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/requestHandlers";
import filesService from "../services/filesService";
import crypto from "crypto";

class FilesController {
  async uploadFile(req: Request, res: Response) {
        try {
        if (!req.file) {
            return sendError(res, "No se ha subido ningún archivo", 400);
        }

        const secureUrl = await filesService.uploadToCloudinary(req.file.buffer);

        return sendSuccess(res, { url: secureUrl });
        } catch (error: any) {
        sendError(res, error.message);
        }
    }

    private generateSignature = (params: Record<string, string>) => {
        const sortedParams = Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join('&');

        return crypto
            .createHmac('sha256', process.env.CLOUDINARY_API_SECRET as string)
            .update(sortedParams)
            .digest('hex');
    };

    getUploadSignature = async (_req: Request, res: Response) => {
        try {
            const timestamp = Math.round(new Date().getTime() / 1000);

            try {
                const signature = this.generateSignature({ timestamp: timestamp.toString(), folder: "uploads" });
                console.log("Firma generada:", signature);

                return sendSuccess(res, {
                    signature,
                    timestamp,
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                });
            } catch (error) {
                console.error("Error llamando a generateSignature:", error);
                return sendError(res, "Error al generar la firma", 500);
            }
        } catch (error) {
            return sendError(res, "Error al generar la firma", 500);
        }
    };
}

export default new FilesController();
