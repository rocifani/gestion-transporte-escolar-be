import { Router } from "express";
import userRoutes from "./userRoutes";
import tripRoutes from "./tripRoutes";
import vehicleRoutes from "./vehicleRoutes";
import childRoutes from "./childRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/trips", tripRoutes);
router.use("/vehicle", vehicleRoutes);
router.use("/child", childRoutes);

export default router;