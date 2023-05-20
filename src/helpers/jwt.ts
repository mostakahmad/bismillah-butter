import config from "config";
import jsonwebtoken from "jsonwebtoken";

const JWT_SECRET = config.get<string>("jwt.secret");

const getJwtInfo = function (token: string) {
  let decoded: any;

  try {
    decoded = jsonwebtoken.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (err) {
    return false;
  }
};

export { getJwtInfo };
