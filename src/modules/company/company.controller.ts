import { NextFunction, Request, Response } from "express";
import config from "config";
import { companyService } from ".";
import { ApiError } from "../../errors";
import mongoose from "mongoose";
import { IAuditTrail } from "./company.interfaces";


const getAllCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const companies = await companyService.findAllByQuery({userID: 'd'.toString()});

    return res.status(200).send({
      success: true,
      data: {
        companies: companies
      },
    });
  } catch (error) {
    next(error);
  }
};

const createCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, userID } = req.body;
    // check if the name already exists
    const checkMenu = await companyService.findOneByQuery({
      name
    });

    // if (checkMenu) {
    //   throw new ApiError(500, `${req.body.name} already exists`);
    // }

    // bind audit trails inside req.body
    const newMenu = await companyService.createOne({
      ...req.body
    });

    if (!newMenu._id)
      throw new ApiError(500, "Customer not created.");

      const companies = await companyService.findAllByQuery({userID:userID});

      return res.status(200).send({
        success: true,
        data: {
          companies: companies
        },
      });
  } catch (error) {
    next(error);
  }
};


const updateCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, userID } = req.body;
    // convert menuId string to ObjectId
    const menuId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      req.params._id
    );

    const existingMenu = await companyService.findOneById(menuId, userID);

    if (!existingMenu) {
      throw new ApiError(404, "Customer Not Found.");
    }

    // check if the following properties are already exists
    const checkMenu = await companyService.findOneByQuery({
      name: req.body.name,
      userID: userID
    });
    if (checkMenu && checkMenu._id.toString() != menuId.toString())
      throw new ApiError(404, `Your credentials already exists`);


    // generate audit trails
    let auditTrails: IAuditTrail = {
      ...existingMenu?.audit_trails,
      updated_at: new Date(),
      updated_by: `Mr. Test`,
      updated_detail: `Updated By Mr. Test`,
    };

    const updatedMenu = await companyService.updateById(
      menuId,
      req.body,
      auditTrails
    );

    if (!updatedMenu)
      throw new ApiError(500, "Menu not updated.");

      const companies = await companyService.findAllByQuery({userID:userID});

      return res.status(200).send({
        success: true,
        data: {
          companies: companies
        },
      });
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // convert menuId string to ObjectId
    const menuId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      req.params._id
    );

    const deletedMenu = await companyService.deleteById(menuId, req.params.userID);

    if (!deletedMenu)
      throw new ApiError(
        500,
        "Delete Failed. Customer maybe not exist."
      );

      const companies = await companyService.findAllByQuery({userID:req.params.userID});

      return res.status(200).send({
        success: true,
        data: {
          companies: companies
        },
      });
  } catch (error) {
    next(error);
  }
};


export {
  getAllCompany,
  updateCompany,
  deleteCompany,
  createCompany
};
