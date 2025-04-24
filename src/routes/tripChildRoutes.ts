import { Router } from "express";
import TokenValidation from "../utils/verifyToken";
import tripChildController from "../controllers/tripChildController";

const tripRouter = Router();

tripRouter.get("/", TokenValidation, tripChildController.getTripChildByUserId)
tripRouter.get("/:child_id", tripChildController.getTripChildByChildId)
tripRouter.get("/trip/:trip_child_id", tripChildController.getTripChildById)
tripRouter.delete("/:trip_child_id",TokenValidation, tripChildController.deleteTripChild)

export default tripRouter;