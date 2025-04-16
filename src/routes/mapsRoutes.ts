import express from "express";
import mapsController from "../controllers/mapsController";
import TokenValidation from "../utils/verifyToken";

const router = express.Router();

router.get("/places", mapsController.searchPlaces);
router.get("/place-details", mapsController.getPlaceDetails);
router.get("/geocode", mapsController.geocodeAddress);
router.get("/geocode-trip/:id", TokenValidation, mapsController.geocodeAddresses);

export default router;