import { Router } from "express";
import authorizationController from "../controllers/authorizationController";
import TokenValidation from "../utils/verifyToken";

const authorizationRouter = Router();

authorizationRouter.get("/", TokenValidation, authorizationController.getAuthorizationByUser)
authorizationRouter.post("/", TokenValidation, authorizationController.postAuthorization)
authorizationRouter.put("/:id", TokenValidation, authorizationController.putAuthorization)
authorizationRouter.get("/all", authorizationController.getAllAuthorizations)
authorizationRouter.get("/:id", authorizationController.getAuthorizationById)
authorizationRouter.get("/child/:id", authorizationController.getChildAuthorizations)

export default authorizationRouter;