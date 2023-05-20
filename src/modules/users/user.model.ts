import mongoose from "mongoose";
import { IUser, UserDoc, userModelInterface } from "./user.interfaces";
import config from "config";
import { connection } from "../../db/connection";

const userCollectionName = config.get<string>(
  "db.connection.amar_hishab.collections.users"
);

const userSchema = new mongoose.Schema({
  name: String,
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: String,
  org_name: String,
  org_address: String,
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

// const User = mongoose.model<UserDoc, userModelInterface>('User', userSchema, 'user_information')

const User = connection.amar_hishabConnection.model<UserDoc, userModelInterface>(
  "User",
  userSchema,
  userCollectionName
);

export { User };
