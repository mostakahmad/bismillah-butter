import config from "config";
import mongoose, { HydratedDocument, QueryWithHelpers } from "mongoose";
import { connection } from "../../db/connection";
import {
  ICompany,
  ICompanyDoc,
  ICompanyQueryHelpers,
  CompanyModelType,
} from "./company.interfaces";
const collectionName = config.get<string>("db.connection.amar_hishab.collections.companies");

const companySchema = new mongoose.Schema<
  ICompanyDoc,
  CompanyModelType,
  {},
  ICompanyQueryHelpers
>({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  audit_trails: {
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
    created_by: String,
    updated_by: String,
    deleted_by: String,
    created_detail: String, // Created by customer with _id .....
    updated_detail: String, // Updated by staff with _id .....
    deleted_detail: String, // Deleted by admin with _id .....
    admin_note: String, // Customer was deleted on request through phone
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

// query helper for soft deleting
companySchema.query.notDeleted = function notDeleted(
  this: QueryWithHelpers<any, HydratedDocument<ICompanyDoc>, ICompanyQueryHelpers>
) {
  return this.where({ is_deleted: false });
};

companySchema.statics.build = (attr: ICompany) => {
  return new Company(attr);
};

const Company = connection.amar_hishabConnection.model<ICompanyDoc, CompanyModelType>(
  "Company",
  companySchema,
  collectionName
);

export { Company };
