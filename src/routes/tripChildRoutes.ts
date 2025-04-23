import { Router } from "express";
import TokenValidation from "../utils/verifyToken";
import tripChildController from "../controllers/tripChildController";

const tripRouter = Router();

tripRouter.get("/", TokenValidation, tripChildController.getTripChildByUserId)
tripRouter.get("/:child_id", tripChildController.getTripChildByChildId)

export default tripRouter;