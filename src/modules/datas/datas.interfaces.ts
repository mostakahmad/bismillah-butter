import mongoose, {
  HydratedDocument,
  Model,
  ObjectId,
  QueryWithHelpers,
} from "mongoose";

interface IDatas {
  date: Date;
  company: String;
  userID: string;
  purchase:[
    {
      pricekg: Number;
      amount: Number;
      price: Number;
    }
  ];
  sell: [
    {
      name: String;
      price: Number;
    }
  ];
  totalPurchase: Number;
  totalSell: Number;
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

interface IDatasDoc extends mongoose.Document {
  date: Date;
  company: String;
  price: Number;
  userID: string;
  purchase:[
    {
      pricekg: Number;
      amount: Number;
      price: Number;
    }
  ];
  sell: [
    {
      name: String;
      price: Number;
    }
  ];
  totalPurchase: Number;
  totalSell: Number;
  audit_trails: IAuditTrail;
  is_deleted: boolean;
}

// interface of query helper for soft deleting
interface IDatasQueryHelpers {
  notDeleted(): QueryWithHelpers<
    HydratedDocument<IDatasDoc>,
    HydratedDocument<IDatasDoc>,
    IDatasQueryHelpers
  >;
}

interface DatasModelInterface extends mongoose.Model<IDatas, IDatasDoc> {
  build(attr: IDatas): IDatasDoc;
}

// merge two model type
type DatasModelType = Model<IDatasDoc, IDatasQueryHelpers> & DatasModelInterface;

export {
  IDatas,
  IDatasDoc,
  IAuditTrail,
  DatasModelInterface,
  DatasModelType,
  IDatasQueryHelpers,
};
