import { Router } from "express";
import userController from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers)
userRouter.get("/:id", userController.getUserById)
userRouter.post("/", userController.postUser)
userRouter.put("/:id", userController.putUser)

export default userRouter;