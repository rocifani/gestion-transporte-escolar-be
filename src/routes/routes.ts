import { Router } from "express";
import userRoutes from "./userRoutes";
import tripRoutes from "./tripRoutes";
import vehicleRoutes from "./vehicleRoutes";
import childRoutes from "./childRoutes";
import mapsRoutes from "./mapsRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/trips", tripRoutes);
router.use("/vehicle", vehicleRoutes);
router.use("/child", childRoutes);
router.use("/maps", mapsRoutes);

export default router;