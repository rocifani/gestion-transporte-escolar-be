import { Router } from "express";
import childController from "../controllers/childController";
import TokenValidation from "../utils/verifyToken";

const childRouter = Router();

childRouter.get("/:id", childController.getChildById)
childRouter.post("/",TokenValidation, childController.postChild)
childRouter.put("/:id",TokenValidation, childController.putChild)
childRouter.get("/",TokenValidation, childController.getChildByUser)
childRouter.delete("/:id",TokenValidation, childController.deleteChild)
export default childRouter;