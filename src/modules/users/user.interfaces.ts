import mongoose from "mongoose";

interface IUser {
  name: string;
  phone: string;
  email: String,
  org_name: String,
  org_address: String,
  password: string;
}

interface UserDoc extends mongoose.Document {
  name: string;
  phone: string;
  email: String,
  org_name: String,
  org_address: String,
  password: string;
}

interface userModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUser): UserDoc;
}

export { IUser, UserDoc, userModelInterface };
