import express from "express";
import mapsController from "../controllers/mapsController";

const router = express.Router();

router.get("/places", mapsController.searchPlaces);
router.get("/place-details", mapsController.getPlaceDetails);
router.get("/geocode", mapsController.geocodeAddress);
router.get("/geocode-trip", mapsController.geocodeAddresses);

export default router;