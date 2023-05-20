import mongoose from "mongoose";
import { IAuditTrail, ICompany } from "./company.interfaces";
import { Company } from "./company.model";

// get company by id
const findOneById = (_id: mongoose.Types.ObjectId, userID:string) => {
  return Company.findOne({_id:_id, userID:userID});
};

/**
 * @param query
 * @returns
 */
const findOneByQuery = (query: object) => {
  return Company.findOne(query).notDeleted();
};

// get companys by filter object
const findAllByQuery = (query: object) => {
  return Company.find(query);
};

// create new company
const createOne = (company: ICompany) => {
  const newCompany = Company.build(company);

  return newCompany.save();
};

const updateById = (
  _id: mongoose.Types.ObjectId,
  updateBody: ICompany,
  auditTrails: IAuditTrail
) => {
  const { updated_at, updated_by, updated_detail } = auditTrails;
  return Company.findByIdAndUpdate(
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
  ).notDeleted();
};

/**
 * delete by id
 * @param orderId
 * @param audit_trails
 * @returns
 */
const deleteById = (_id: mongoose.Types.ObjectId, userID: string) => {
  return Company.deleteOne({ _id:_id,  userID:userID});
};

// exports all services
export {
  createOne,
  updateById,
  deleteById,
  findOneById,
  findOneByQuery,
  findAllByQuery,
};
