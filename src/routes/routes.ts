import { Router } from "express";
import userRoutes from "./userRoutes";
import tripRoutes from "./tripRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/trips", tripRoutes);

export default router;