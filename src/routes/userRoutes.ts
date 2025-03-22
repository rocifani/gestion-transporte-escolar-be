import { Router } from "express";
import { TokenValidation } from "../utils/verifyToken";
import userController from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers)
userRouter.get("/profile", TokenValidation, userController.getUserById)
userRouter.post("/signup", userController.signup)
userRouter.put("/update", TokenValidation, userController.putUser)
userRouter.post("/login", userController.login)
userRouter.get("/confirm-email/:token", userController.confirmEmail)

export default userRouter;