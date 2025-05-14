"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mapsController_1 = __importDefault(require("../controllers/mapsController"));
const verifyToken_1 = __importDefault(require("../utils/verifyToken"));
const router = express_1.default.Router();
router.get("/places", mapsController_1.default.searchPlaces);
router.get("/place-details", mapsController_1.default.getPlaceDetails);
router.get("/geocode", mapsController_1.default.geocodeAddress);
router.get("/geocode-trip/:id", verifyToken_1.default, mapsController_1.default.geocodeAddresses);
exports.default = router;
