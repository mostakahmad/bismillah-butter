import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const objectToVallidate: any = {
  user_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
};

const validator = (req: Request, res: Response, next: NextFunction) => {
  try {
    Joi.object(objectToVallidate).validate(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    next(error);
  }
};

export { validator as userValidator };
