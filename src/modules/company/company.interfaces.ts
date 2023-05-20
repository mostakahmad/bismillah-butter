import mongoose, {
  HydratedDocument,
  Model,
  ObjectId,
  QueryWithHelpers,
} from "mongoose";

interface ICompany {
  name: string;
  phone:string;
  email:string;
  address:string;
  userID: string;
}

interface IAuditTrail {
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  created_by?: string;
  updated_by?: string;
  deleted_by?: string;
  created_detail?: string; // Created by customer with _id .....
  updated_detail?: string; // Updated by staff with _id .....
  deleted_detail?: string; // Deleted by admin with _id .....
  admin_note?: string; // Customer was deleted on request through phone
}

interface ICompanyDoc extends mongoose.Document {
  name: string;
  phone:string;
  email:string;
  address:string;
  userID: string;
  audit_trails: IAuditTrail;
  is_deleted: boolean;
}

// interface of query helper for soft deleting
interface ICompanyQueryHelpers {
  notDeleted(): QueryWithHelpers<
    HydratedDocument<ICompanyDoc>,
    HydratedDocument<ICompanyDoc>,
    ICompanyQueryHelpers
  >;
}

interface CompanyModelInterface extends mongoose.Model<ICompany, ICompanyDoc> {
  build(attr: ICompany): ICompanyDoc;
}

// merge two model type
type CompanyModelType = Model<ICompanyDoc, ICompanyQueryHelpers> & CompanyModelInterface;

export {
  ICompany,
  ICompanyDoc,
  IAuditTrail,
  CompanyModelInterface,
  CompanyModelType,
  ICompanyQueryHelpers,
};
