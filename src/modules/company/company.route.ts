import express, { Router } from "express";
import { isLoggedin } from "../auth";
import * as companyController from "./company.controller";

const router: Router = express.Router();

// user login with otp verification
// router.get("/company", companyController.getAllCompany);
router.post('/company', companyController.createCompany);
router.put('/company/:_id', companyController.updateCompany);
router.delete('/company/:_id/:userID', companyController.deleteCompany);

export { router as companyRouter };