import { Router } from "express";
import notificationController from "../controllers/notificationController";
import TokenValidation from "../utils/verifyToken";

const notificationRouter = Router();

notificationRouter.get("/:id", notificationController.getNotificationById)
notificationRouter.post("/",TokenValidation, notificationController.postNotification)
notificationRouter.get("/",TokenValidation, notificationController.getNotificationByUser)
notificationRouter.delete("/:id",TokenValidation, notificationController.deleteNotification)
notificationRouter.put("/:id",TokenValidation, notificationController.markNotificationAsRead)
export default notificationRouter;