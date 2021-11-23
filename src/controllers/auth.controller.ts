import { NextFunction, Request, Response } from "express";
import HttpException from "../common/http-exception";
import * as AuthService from "../services/auth.service";
import { hash, verify } from "argon2";
import { randomBytes } from "crypto";
import User from "../models/user/user.model";

export const register = async(req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    console.log(req.body)
    const password = req.body.password;

    try {
        const hashedPw = await hash(password);
        
        const user = new User({
            email: email,
            password: hashedPw,
            active: false,
        })

        const userCreated = await user.save();

        try {
            await AuthService.generateConfirmationEmail(user);
        } catch (err: any) {
            next(err);
        }
        

        res.status(201).json({
            message:  "User created!",
            userId: userCreated._id
        })

    } catch (err: any) {
        err.statusCode = 422;
        err.message = "Validation failed";
        next(err);
    }
}

export const confirmAccount = async(req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token;
    console.log(token)
    try  {
        let user = await User.findOne(({confirmationToken: token, resetTokenExpiration: {$gt: Date.now() }}))

        if(!user) {
            const err = new HttpException(422, "User doesn't exist");
            throw err;
        }

       await  User.updateOne(
            {_id: user._id},
            {
                $set: {
                    active: true,
                },
                $unset: {
                    confirmationToken: 1,
                    confirmationTokenExpiration: 1,
                }
            }
            )
        

            res.status(201).json({
                message: 'User updated!'
            })


    } catch (error: any) {
        next(error);
    }
}

export const login = async(req: Request, res: Response, next: NextFunction) => {
    const email: string =  req.body.email;
    const password: string = req.body.password;

    
    try {
        const user = await AuthService.find(email);

        if(!user?.active) {
            const error = new HttpException(404, "User not found");
            throw error;
        }

        const verifyUser = await verify(user.password, password);

        if(!verifyUser) {
            const error = new HttpException(422, "Wrong password. Try again or click ‘Forgot your password?’ to reset it.");
            throw error;
        }


        res.status(201).json({
            message: "User found!",
            user: user,
        })
    }catch(err: any) {
        next(err);
    }
}

