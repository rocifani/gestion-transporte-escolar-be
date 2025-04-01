import express from "express";
import filesController from "../controllers/filesController";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

router.post("/upload", upload.single("file"), filesController.uploadFile);
router.post("/signature", filesController.getUploadSignature.bind(filesController));

export default router;