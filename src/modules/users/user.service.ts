import mongoose from "mongoose";
import { User } from "./user.model";
import { IUser } from "./user.interfaces";
import { ApiError } from "../../errors";
import { Company } from "../company/company.model";

const create = async (cxtObje: IUser) => {
  const userByPhone = await getOne({ phone: cxtObje.phone });
  if (userByPhone) {
    throw new ApiError(400, "Phone already taken");
  }
  const user = User.build(cxtObje);

  return user.save();
};

const getAll = async (cxtObje: object) => {
  return User.find(cxtObje);
};

const getOne = async (cxtObje: object) => {
  return User.findOne(cxtObje);
};

const getById = async (_id: mongoose.Types.ObjectId) => {
  return User.findById(_id);
};

const findOneByQuery = (query: object) => {
  return User.findOne(query);
};


const updateById = async (_id: mongoose.Types.ObjectId, updateBody: object) => {
  const user = await getById(_id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  Object.assign(user, updateBody);

  return user.save();
};
/**
 *
 * @param query
 * @param updateBody
 * @param auditTrails
 * @returns
 */
const updateByQuery = async (
  query: Object,
  updateBody: object,
) => {
  return User.findOneAndUpdate(
    query,
    {
      $set: {
        ...updateBody,
      },
    },
    {
      new: true,
    }
  );
};

// get menus by filter object
const findAllByQuery = () => {
  return Company.find({}).notDeleted();
};

/**
 *
 * @param _id
 * @param auditTrails
 * @returns
 */
const deleteById = async (
  _id: mongoose.Types.ObjectId
) => {
  return User.findByIdAndDelete(
    _id
  );
};

export { create, getAll, getOne, getById, updateById, findOneByQuery, findAllByQuery, updateByQuery, deleteById };
