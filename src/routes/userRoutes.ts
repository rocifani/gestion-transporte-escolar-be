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
userRouter.post("/forgot-password", userController.forgotPassword)
userRouter.post("/reset-password/:token", userController.resetPassword)
userRouter.post("/signup-google", userController.loginWithGoogle)

export default userRouter;