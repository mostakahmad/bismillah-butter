import express, { Router } from "express";
import { isLoggedin } from "../auth";
import * as datasController from "./datas.controller";

const router: Router = express.Router();

// user login with otp verification
router.post("/purchase/add",isLoggedin,  datasController.createPurchase);
router.post("/sell/add",isLoggedin,  datasController.createSell);
router.get("/datas/all", isLoggedin, datasController.getAllDatas);
router.post("/filter/data",isLoggedin,  datasController.filterData);

export { router as datasRouter };