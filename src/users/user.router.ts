import express from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

export function getUserRouter() {
  const userRouter = express.Router();
  const userService = new UserService();
  const userController = new UserController(userService);

  userRouter.get(
    "/",
    userController.detectFraud.bind(userController)
  );

  return userRouter;
}
