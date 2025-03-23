import { Router } from "express";
import userRoutes from "./userRoutes";
import tripRoutes from "./tripRoutes";
import vehicleRoutes from "./vehicleRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/trips", tripRoutes);
router.use("/vehicle", vehicleRoutes);

export default router;