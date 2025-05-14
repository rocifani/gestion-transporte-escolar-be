import { Router } from "express";
import tripController from "../controllers/tripController";
import TokenValidation from "../utils/verifyToken";

const tripRouter = Router();
tripRouter.get("/price", TokenValidation, tripController.getPaymentsByDriver)
tripRouter.get("/", TokenValidation, tripController.getTripByUser)
tripRouter.get("/:id", tripController.getTripById)
tripRouter.get("/", tripController.getAllTrips)
tripRouter.put("/pay", TokenValidation, tripController.markTripsAsPaid)
tripRouter.post("/start/:id", TokenValidation, tripController.startTrip)
tripRouter.post("/finish/:id", TokenValidation, tripController.finishTrip)
tripRouter.post("/cancel/:id", TokenValidation, tripController.cancelTripById)
tripRouter.post("/", tripController.postTrip)

export default tripRouter;