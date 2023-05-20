import config from "config";
import mongoose, { HydratedDocument, QueryWithHelpers } from "mongoose";
import { connection } from "../../db/connection";
import {
  IDatas,
  IDatasDoc,
  IDatasQueryHelpers,
  DatasModelType,
} from "./datas.interfaces";
const collectionName = config.get<string>("db.connection.amar_hishab.collections.datas");

const datasSchema = new mongoose.Schema<
  IDatasDoc,
  DatasModelType,
  {},
  IDatasQueryHelpers
>({
  date: {
    type: Date,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  purchase: [
    {
      pricekg: Number,
      amount: Number,
      price: Number
    },
  ],
  sell: [
    {
      name: String,
      price: Number
    },
  ],
  totalPurchase: Number,
  totalSell: Number,
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
datasSchema.query.notDeleted = function notDeleted(
  this: QueryWithHelpers<any, HydratedDocument<IDatasDoc>, IDatasQueryHelpers>
) {
  return this.where({ is_deleted: false });
};

datasSchema.statics.build = (attr: IDatas) => {
  return new Datas(attr);
};

const Datas = connection.amar_hishabConnection.model<IDatasDoc, DatasModelType>(
  "Datas",
  datasSchema,
  collectionName
);

export { Datas };
