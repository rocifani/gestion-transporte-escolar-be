import { Router } from "express";
import tripController from "../controllers/tripController";
import TokenValidation from "../utils/verifyToken";

const tripRouter = Router();
tripRouter.get("/price", TokenValidation, tripController.getPaymentsByDriver)
tripRouter.get("/", TokenValidation, tripController.getTripByUser)
tripRouter.get("/:id", tripController.getTripById)
tripRouter.get("/", tripController.getAllTrips)
tripRouter.post("/", tripController.postTrip)

export default tripRouter;