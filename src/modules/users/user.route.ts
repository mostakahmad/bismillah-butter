import express, { Router } from "express";
import * as userController from "./user.controller";
import { userValidator } from "./user.validation";

const router: Router = express.Router();

router.get("/user", userController.getUsers);
router.get("/user/:_id", userController.getUser);
router.post("/user", userValidator, userController.createUser);
router.put("/user/:_id", userController.updateUser);
router.delete("/user/:_id", userController.deleteUser);


export { router as userRouter };
