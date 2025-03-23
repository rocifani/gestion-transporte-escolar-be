import { Router } from "express";
import vehicleController from "../controllers/vehicleController";
import TokenValidation from "../utils/verifyToken";

const vehicleRouter = Router();

vehicleRouter.get("/:id", TokenValidation, vehicleController.getVehicleById)
vehicleRouter.post("/", TokenValidation, vehicleController.postVehicle)
vehicleRouter.put("/", TokenValidation, vehicleController.putVehicle)
vehicleRouter.get("/", TokenValidation, vehicleController.getVehicleByUser)

export default vehicleRouter;