import { json } from "body-parser";
import config from "config";
import cors from "cors";
import express from "express";
import { ApiError, errorConverter, errorHandler } from "./errors";
import { authRouter } from "./modules/auth/auth.route";
import { datasRouter } from "./modules/datas/datas.route";
import { responseHandler } from "./helpers/responseHandler";
import { userRouter } from "./modules/users";
import { companyRouter } from "./modules/company";

const app = express();
const port = config.get<number>("server.port");

app.use(cors());
app.use(json());
app.use(responseHandler);
app.use("/v1/api", authRouter);
app.use("/v1/api", datasRouter);
app.use("/v1/api", userRouter);
app.use("/v1/api", companyRouter);

// static files
app.use('/public/files', express.static('./src/public/uploads'))


// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(404, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

const server: any = app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  console.log(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});
