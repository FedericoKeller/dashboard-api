import { NextFunction, Request, Response } from "express";
import HttpException from "../common/http-exception";
import * as AuthService from "../services/auth.service";
import { hash, verify } from "argon2";
import User from "../models/user/user.model";
import { validationResult } from "express-validator";
import { Tokens } from "../models/user/user.interface";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new HttpException(
        422,
        "Validation failed, entered data is incorrect."
      );
      throw error;
    }

    const hashedPw = await hash(password);

    const user = new User({
      email: email,
      password: hashedPw,
      active: false,
    });

    const userCreated = await user.save();

    const emailData: Tokens = {
      confirmationToken: await AuthService.createToken(),
      confirmationTokenExpiration: Date.now() + 3600000,
    };

    await AuthService.generateEmail(user, emailData, "ActivateAccount");

    res.status(201).json({
      message: "User created!",
      userId: userCreated._id,
    });
  } catch (err: any) {
    if (!(err instanceof HttpException)) {
      err.statusCode = 422;
      err.message = "Validation failed";
    }

    next(err);
  }
};

export const confirmAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.params.token;

  try {
    let user = await User.findOne({
      "tokens.confirmationToken": token,
      "tokens.resetTokenExpiration": { $gt: Date.now() },
    });

    if (!user) {
      const err = new HttpException(
        422,
        "User doesn't exist or the account has been already confirmed."
      );
      throw err;
    }

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          active: true,
        },
        $unset: {
          "tokens.confirmationToken": 1,
          "tokens.confirmationTokenExpiration": 1,
        },
      }
    );

    res.status(201).json({
      message: "User updated!",
    });
  } catch (error: any) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new HttpException(
        422,
        "Validation failed, entered data is incorrect."
      );
      throw error;
    }
    
  const email: string = req.body.email;

  try {
    const user = await AuthService.find(email);

    if (!user) {
      const err = new HttpException(422, "User doesn't exist.");
      throw err;
    }

    const emailData: Tokens = {
      confirmationToken: await AuthService.createToken(),
      confirmationTokenExpiration: Date.now() + 3600000,
    };

    await AuthService.generateEmail(user, emailData, "ResetPassword");

    res.status(201).json({
      message: "Email sent!",
    });
  } catch (err: any) {
    if (!(err instanceof HttpException)) {
      err.statusCode = 500;
      next(err);
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new HttpException(
        422,
        "Validation failed, entered data is incorrect."
      );
      throw error;
    }

    const user = await AuthService.find(email);

    const verifyUser = await verify(user!.password, password);

    if (!verifyUser) {
      const error = new HttpException(
        422,
        "Wrong password. Try again or click ‘Forgot your password?’ to reset it."
      );
      throw error;
    }

    res.status(201).json({
      message: "User found!",
      user: user,
    });
  } catch (err: any) {
    next(err);
  }
};
