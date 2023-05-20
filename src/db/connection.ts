import config from "config";
import mongoose from "mongoose";

let connection = {
  amar_hishabConnection: mongoose.createConnection(
    config.get<string>("db.connection.amar_hishab.url")
  )
};

export { connection };
