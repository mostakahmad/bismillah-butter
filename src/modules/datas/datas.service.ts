import mongoose from "mongoose";
import { IAuditTrail, IDatas } from "./datas.interfaces";
import { Datas } from "./datas.model";

// get datas by id
const findOneById = (_id: mongoose.Types.ObjectId) => {
  return Datas.findById(_id).notDeleted();
};

/**
 * @param query
 * @returns
 */
const findOneByQuery = (query: object) => {
  return Datas.findOne(query);
};

// get companys by filter object
const findAllByQuery = (query: object = {}) => {
  return Datas.find(query).sort({date: 1});
};

// get companys by filter object
// const findAllByQuery = (query: object = {}) => {
//   const fDate = "2023-05-10";
//   return Datas.find();
// };

// create new datas
const createOne = (datas: IDatas) => {
  const newDatas = Datas.build(datas);

  return newDatas.save();
};

const updateById = (
  _id: mongoose.Types.ObjectId,
  updateBody: IDatas,
  auditTrails: IAuditTrail
) => {
  const { updated_at, updated_by, updated_detail } = auditTrails;
  return Datas.findByIdAndUpdate(
    _id,
    {
      $set: {
        ...updateBody,
        "audit_trails.updated_at": updated_at,
        "audit_trails.updated_by": updated_by,
        "audit_trails.updated_detail": updated_detail,
      },
    },
    { new: true }
  );
};

/**
 * delete by id
 * @param orderId
 * @param audit_trails
 * @returns
 */
const deleteById = (_id: mongoose.Types.ObjectId, auditTrails: IAuditTrail) => {
  const { deleted_at, deleted_by, deleted_detail } = auditTrails;
  return Datas.findByIdAndUpdate(
    _id,
    {
      $set: {
        is_deleted: true,
        "audit_trails.deleted_at": deleted_at,
        "audit_trails.deleted_by": deleted_by,
        "audit_trails.deleted_detail": deleted_detail,
      },
    },
    { new: true }
  ).notDeleted();
};
const deleteMany = async () => {
  return Datas.deleteMany({ purchase: [], sell: []  });
}

// exports all services
export {
  createOne,
  updateById,
  deleteById,
  findOneById,
  findOneByQuery,
  findAllByQuery,
  deleteMany
};
