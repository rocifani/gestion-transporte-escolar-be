import { Router } from "express";
import userRoutes from "./userRoutes";
import tripRoutes from "./tripRoutes";
import authorizationRoutes from "./authorizationRoutes";
import childRoutes from "./childRoutes";
import mapsRoutes from "./mapsRoutes";
import filesRoutes from "./filesRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/trips", tripRoutes);
router.use("/authorization", authorizationRoutes);
router.use("/child", childRoutes);
router.use("/maps", mapsRoutes);
router.use("/files", filesRoutes);

export default router;