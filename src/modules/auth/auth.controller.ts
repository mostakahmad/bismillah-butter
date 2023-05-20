import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import config from "config";
import jsonwebtoken from "jsonwebtoken";
import { userService } from "../users";
import { ApiError } from "../../errors";
import { companyService } from "../company";

const JWT_SECRET = config.get<string>("jwt.secret");
const JWT_EXPIRES_IN = config.get<string>("jwt.accessTokenExpiresIn");

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.phone || !req.body.password) {
      throw new ApiError(404, "Missing Parameters");
    }

    const user = await userService.findOneByQuery({
      phone: req.body.phone,
    });

    if (!user) {
      throw new ApiError(404, "Incorrect Phone");
    }

    if (!user.password) {
      throw new ApiError(401, "Invalid Passwordless User");
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw new ApiError(401, "Incorrect Password");
    }

    const token = jsonwebtoken.sign(
      { id: user._id, phone: user.phone },
      JWT_SECRET,
      { expiresIn: `${JWT_EXPIRES_IN}d` }
    );

    const companies = await companyService.findAllByQuery({userID: user._id.toString()});

    return res.status(200).send({
      success: true,
      data: {
        token: token,
        user: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          org_name: user.org_name,
          org_address: user.org_address,
          companies: companies
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


const verifyLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      throw new ApiError(404, "Missing Phone");
    }
    const user = await userService.findOneByQuery({ phone: phone });

    if (!user) {
      throw new ApiError(404, "User Not Found");
    }

    const token = jsonwebtoken.sign(
      { id: user._id, email: user.phone },
      JWT_SECRET,
      { expiresIn: `${JWT_EXPIRES_IN}d` }
    );
    return res.status(200).send({
      success: true,
      data: {
        token: token,
        customer: {
          _id: user._id,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  login as loginUser,
  verifyLogin
};
