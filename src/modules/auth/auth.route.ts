import express, { Router } from "express";
import * as authController from "./auth.controller";

const router: Router = express.Router();

// user login with otp verification
router.post("/user/login", authController.loginUser);

export { router as authRouter };
