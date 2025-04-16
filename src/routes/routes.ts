import { Router } from "express";
import userRoutes from "./userRoutes";
import tripRoutes from "./tripRoutes";
import authorizationRoutes from "./authorizationRoutes";
import childRoutes from "./childRoutes";
import mapsRoutes from "./mapsRoutes";
import filesRoutes from "./filesRoutes";
import paymentRoutes from "./paymentRoutes";
import tripChildRoutes from "./tripChildRoutes";
import priceRoutes from "./priceRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/trips", tripRoutes);
router.use("/authorization", authorizationRoutes);
router.use("/child", childRoutes);
router.use("/tripchild", tripChildRoutes);
router.use("/maps", mapsRoutes);
router.use("/files", filesRoutes);
router.use("/payment", paymentRoutes);
router.use("/price", priceRoutes)

export default router;