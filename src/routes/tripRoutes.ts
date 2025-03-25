import { Router } from "express";
import tripController from "../controllers/tripController";
import TokenValidation from "../utils/verifyToken";

const tripRouter = Router();

tripRouter.get("/:id", tripController.getTripById)
tripRouter.post("/", tripController.postTrip)
tripRouter.put("/:id", tripController.putTrip)
tripRouter.get("/",TokenValidation, tripController.getTripByUser)
export default tripRouter;