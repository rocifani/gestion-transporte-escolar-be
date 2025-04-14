import { Router } from "express";
import tripController from "../controllers/tripController";
import TokenValidation from "../utils/verifyToken";

const tripRouter = Router();

tripRouter.get("/:id", tripController.getTripById)
tripRouter.get("/", tripController.getAllTrips)
tripRouter.post("/", tripController.postTrip)
tripRouter.get("/",TokenValidation, tripController.getTripByUser)
export default tripRouter;