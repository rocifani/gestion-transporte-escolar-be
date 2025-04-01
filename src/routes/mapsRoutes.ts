import express from "express";
import mapsController from "../controllers/mapsController";

const router = express.Router();

router.get("/places", mapsController.searchPlaces);
router.get("/place-details", mapsController.getPlaceDetails);

export default router;