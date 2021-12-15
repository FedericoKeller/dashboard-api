import { Router, Request, Response } from "express";
import * as AuthController from "../controllers/auth.controller";
import { body } from "express-validator";
import * as AuthService from "../services/auth.service";
import HttpException from "../common/http-exception";

export const authRoutes = Router();

authRoutes.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const user = await AuthService.find(req.body.email);
        if (!user?.active) {
          return Promise.reject("User not found");
        }
      })
      .normalizeEmail(),
  ],
  AuthController.login
);

authRoutes.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const user = await AuthService.find(req.body.email);
        console.log(user);
        if (user) {
          return Promise.reject("E-mail already exists!");
        }
      })
      .normalizeEmail(),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Please enter a password of at least 6 characters."),

    body("passwordConfirm").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password should be equal.");
      }

      return true;
    }),
  ],
  AuthController.register
);

authRoutes.put("/reset/:token", AuthController.confirmAccount);

authRoutes.post(
  "/resetPassword",
  [body("email").isEmail().normalizeEmail()],
  AuthController.resetPassword
);
