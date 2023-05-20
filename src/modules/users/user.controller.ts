import express, { NextFunction, Request, Response } from "express";
import * as userService from "./user.service";
import { resTransformer } from "./user.transformer";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ApiError } from "../../errors";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAll({});
    const transormedList = resTransformer(users);
    return res.status(200).send(transormedList);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @objective Get user by id
 * @endpoint v1/api/user/object_id
 * @mehtod GET
 * @res { "_id": "63bfcab7050004c0d5aabf1b", "phone": "+470186795496323", "user_name": "Jhon"}
 */
const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      req.params._id
    );
    const user = await userService.getById(_id);

    if (!user) {
      throw new ApiError(404, "User Not Found");
    }
    const transormedUser = resTransformer(user);
    return res.status(200).send(transormedUser);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @objective Create an user
 * @endpoint v1/api/user
 * @mehtod POST
 * @reqbody = {"phone":"+470186795496323","user_name":"David","password":"david@4326"}
 * @res {"_id":"63c2863136a43d4587ab9023","phone":"+470186795496323","user_name":"David"}
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
  // try {
  //   const { user_name, phone } = req.body;
  //   const password = bcrypt.hashSync(<string>req.body.password);
  //   const user = await userService.create({ user_name, phone, password });
  //   const transormedUser = resTransformer(user);
  //   return res.status(201).send(transormedUser);
  // } catch (error) {
  //   next(error);
  // }
};

/**
 *
 * @objective Update an user
 * @endpoint v1/api/user/:_id
 * @mehtod PUT
 * @reqbody = {"phone":"+470186795496323","user_name":"David","password":"david@4326"}
 * @res {"_id":"63c2863136a43d4587ab9023","phone":"+470186795496323","user_name":"David"}
 */
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
      req.params._id
    );
    const { user_name, phone } = req.body;
    const user = await userService.updateById(_id, { user_name, phone });
    const transormedUser = resTransformer(user);

    return res.status(201).send(transormedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // try {
  //   const _id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(
  //     req.params._id
  //   );
  //   const userID = _id;
    // const user = await userService.deleteById(userID );

  //   return res.status(200).send({
  //     success: true,
  //     message: `${user?.user_name} successfully deleted`,
  //   });
  // } catch (error) {
  //   next(error);
  // }
};

export {
  getAll as getUsers,
  getOne as getUser,
  create as createUser,
  update as updateUser,
  deleteUser
};
