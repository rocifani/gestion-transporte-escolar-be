import { Router } from "express";
import vehicleController from "../controllers/vehicleController";
import TokenValidation from "../utils/verifyToken";

const vehicleRouter = Router();


vehicleRouter.post("/", TokenValidation, vehicleController.postVehicle)
vehicleRouter.put("/", TokenValidation, vehicleController.putVehicle)
vehicleRouter.get("/all", TokenValidation, vehicleController.getAllVehicles)
vehicleRouter.get("/", TokenValidation, vehicleController.getVehicleByUser)
vehicleRouter.get("/:id", TokenValidation, vehicleController.getVehicleById)

export default vehicleRouter;