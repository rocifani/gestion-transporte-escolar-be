import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

class FilesService {
  async uploadToCloudinary(fileBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            reject(new Error("Error al subir archivo a Cloudinary"));
          } else {
            resolve(result!.secure_url);
          }
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  }
}

export default new FilesService();
