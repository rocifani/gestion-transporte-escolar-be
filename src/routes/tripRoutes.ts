import { Router } from "express";
import tripController from "../controllers/tripController";

const tripRouter = Router();

tripRouter.get("/", tripController.getAllTrips)
tripRouter.get("/:id", tripController.getTripById)
tripRouter.post("/", tripController.postTrip)
tripRouter.put("/:id", tripController.putTrip)

export default tripRouter;