import { Router } from "express";
import priceController from "../controllers/priceController";
import TokenValidation from "../utils/verifyToken";

const priceRouter = Router();

priceRouter.get("/", TokenValidation, priceController.getPriceByUser)
priceRouter.post("/", TokenValidation, priceController.postPrice)
priceRouter.get("/authorization/:id", TokenValidation, priceController.getPriceByUserAuthorization)
priceRouter.get("/all", priceController.getAllPrices)
priceRouter.get("/:id", priceController.getPriceById)

export default priceRouter;