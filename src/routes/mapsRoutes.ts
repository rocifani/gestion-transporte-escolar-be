import express from "express";
import { googlePlacesController } from "../controllers/mapsController";

const router = express.Router();

router.get("/places", googlePlacesController.searchPlaces);
router.get("/place-details", googlePlacesController.getPlaceDetails);

export default router;